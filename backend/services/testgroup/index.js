/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../datasource/parse')
const uuid = require('uuid/v1');
var libStra = require('../stragety');

var moment = require('moment');

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
        var list = yield db.get('testgroup', {slbid: slbid},[{opt: 'desc', key: 'createdAt'}]);
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
     * 删除slb信息
     * @param id
     * @returns {*}
     */
    deleteTest: function*(data) {
        var result = yield db.delete('testgroup', data);
        return result;
    },
    /**
     * 删除slb信息
     * @param id
     * @returns {*}
     */
    updateTest: function*(data, where) {
        var result = yield db.update('testgroup', where, data);
        return result;
    }
}