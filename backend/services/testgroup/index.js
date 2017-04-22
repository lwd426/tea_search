/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../datasource/parse')
const uuid = require('uuid/v1');
var libStra = require('../stragety');
var libServer = require('../webserver')


var moment = require('moment');

function getPercentage(number1, number2){
    return (Math.round(number1 / number2 * 10000) / 100.00)+'%' || 0+'%';// 小数点后两位百分比
}
module.exports = {
    /**
     * 保存slb信息
     * @param name
     * @returns {*}
     */
    saveTestgroup: function*(name, code, slbid) {
        var data = {
            name: name,
            code: code,
            slbid: slbid,
            status: 'new',
            flowaccounting: '-',
            time: '-',
            is_abolished: false,
            version: '-'

        }
        var result = yield db.save('testgroup', data)
        if (result.code) return {
            status: 'failure',
            data: result.message
        }
        return {
            status:'success',
            data: result
        }
    },
    /**
     * 获取slb列表
     * @returns {*}
     */
    getTestgroupList: function*(slbid) {
        var list = yield db.get('testgroup', {slbid: slbid},[{opt: 'desc', key: 'createdAt'},{opt: 'equal', key: 'is_abolished', data: false}]);
        var allservers = yield libServer.getServersInfo({slbid: slbid})
        var i = 0, len = list.length;
        //遍历每个测试项目下的所有策略，累加流量配置
        for(;i<len;i++){
            var tg = list[i];
            var flowaccount = 0.0;
            var straList = yield libStra.getStragetyInfos({tgid: tg.id, stra_status: 'running'})
            var serverNum = straList.length || 0;
            if(serverNum !== 0){
                flowaccount = getPercentage(serverNum, allservers.length) ;
            }

            var publistime = tg.get('time');
            if(publistime === '-'){
                tg.set('status', 'new')
            }else{
                var strageties = yield libStra.getStragetyInfos({tgid: tg.id})
                var status = 'stopped'
                strageties.map((stra)=>{
                    if(stra.get('stra_status') === 'running'){
                        status = 'running'
                    }
                })
                tg.set('status', status)
            }
            tg.set('flowaccounting', flowaccount)
        }

        // 决定测试项目状态的逻辑：
        // 1. 发布时间为空则为new
        // 2. 策略如果有running,则为运行中
        // 3. 如果所有策略有没有running的，则为停止状态
        // var i = 0, len = list.length;
        // for(;i<len;i++){
        //     var tg = list[i];
        //     var publistime = tg.get('time');
        //     if(publistime === '-'){
        //         tg.set('status', 'new')
        //     }else{
        //         var strageties = yield libStra.getStragetyInfos({tgid: tg.id})
        //         var status = 'stopped'
        //         strageties.map((stra)=>{
        //             if(stra.get('stra_status') === 'running'){
        //                 status = 'running'
        //             }
        //         })
        //         tg.set('status', status)
        //     }
        // }
        return list;
    },
    /**
     * 删除测试组信息
     * @param id
     * @returns {*}
     */
    deleteTest: function*(tgid) {
        //判断该测试组下的是否有正在运行的策略，如果有测不能删除
        var straList = yield libStra.getStragetyInfos({tgid: tgid, stra_status: 'running'})
        if(straList.length !== 0){
            return {
                status: 'failure',
                data: '不能删除，该测试组下有正在运行的策略，请先停止或删除！'
            }
        }
        var result = yield db.update('testgroup', {objectId: tgid}, {is_abolished: true});
        return {
            status: 'success',
            data: result
        };
    },
    /**
     * 更新测试组
     * @param id
     * @returns {*}
     */
    updateTest: function*(data, where) {
        var result = yield db.update('testgroup', where, data);
        return result;
    },
     /** 获取测试组的基本信息
     * @param slbid
     * @returns {*}
     */
    getTgInfo: function*(tgid) {
        return yield db.get('testgroup', {objectId: tgid}, [{opt: 'equal', key: 'is_abolished', data: false}]);
    }
}