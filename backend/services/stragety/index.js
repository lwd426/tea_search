/**
 * 用途： 策略维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../datasource/parse')
const uuid = require('uuid/v1');
var moment = require('moment');
var server_service = require('../webserver')
var libServer = require('../webserver')
function getPercentage(number1, number2){
    return (Math.round(number1 / number2 * 10000) / 100.00) || 0;// 小数点后两位百分比
}
module.exports = {
    /**
     * 保存策略信息
     * @param name
     * @returns {*}
     */
    saveStragety: function*(uuid, slbid,tgid,name,desc,cities,servers,serverskey,urls,uids,type) {
        // var allservers = yield libServer.getServersInfo({slbid: slbid})
        // var serverNum = serverskey.length || 0;
        // var flowaccounting = '-'
        // if(serverNum !== 0){
        //     flowaccounting = getPercentage(serverNum, allservers.length) + '%';
        // }
        //保存策略
        //如果是生成基准版本，则获取slb下所有的基准服务器
        var referServers = [], referServersKey = [];
        if(type === 'refer'){
            var list = yield libServer.getServersInfo({slbid: slbid, refer: true})
            list.map((server)=>{
                referServers.push(server.get('ip'))
                referServersKey.push(server.get('key'))
            })
        }
        var data = {
            stra_id : uuid,
            stra_name: name,
            stra_desc: desc,
            stra_cities: cities,
            stra_servers: type !== 'refer' ? servers : referServers,
            stra_serverskey: type !== 'refer' ? serverskey : referServersKey,
            stra_urls: urls,
            stra_uids: uids,
            stra_status: 'new',
            tgid: tgid,
            slbid: slbid,
            type: type,
            is_abolished: false,
            flowaccounting: '',
            time: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        var result =  yield db.save('stragety', data);
        //更新server信息，把uids、urls和策略id更新到server记录里
        if(result){
            var otherwhere = {key: 'ip', opt: 'in', data: servers}
            var data = {urls: urls.join(';'), uids: uids.join(';'), stragetiesinfo: uuid}
            var result2 =  yield server_service.updateWebServer(data, undefined, [otherwhere], 'add')
        }
        return result;
    },
    /**
     * 获取策略列表
     * @returns {*}
     */
    getStragetyList: function*(opts) {
        var allservers = yield libServer.getServersInfo({slbid: opts.slbid})
        var stragetylist =  yield db.get('stragety',opts,  [{opt: 'equal', key: 'is_abolished', data: false}]);
        //为了与web服务器的增删改查一致，所以策略的基准以服务器的key为准
        var i=0; len=stragetylist.length;
        for(;i<len;i++){
            var stragety = stragetylist[i]
            var serverskey = stragety.get("stra_serverskey");
            var servers = yield server_service.getServersInfo(undefined, [{opt: 'in', key:'key', data: serverskey}])
            var serversinfo = [];
            servers.map((server)=>{
                if(server.get('ip') && server.get('ip')!== '')  serversinfo.push(server.get('ip'));
            })
            var serverNum = serverskey.length || 0;
            var flowaccounting = '-'
            if(serverNum !== 0){
                flowaccounting = getPercentage(serverNum, allservers.length) + '%';
            }
            stragety.set("flowaccounting",flowaccounting);
            stragety.set("stra_servers",serversinfo);
        }


        return stragetylist;
    },
    /**
     * 获取单纯的策略信息列表
     * @param opts
     * @returns {*}
     */
    getStragetyInfos: function*(where, opts) {
        if(!opts) opts = [];
        opts.push({opt: 'equal', key: 'is_abolished', data: false})
        var stragetylist =  yield db.get('stragety',where, opts);
        return stragetylist;
    },
    /**
     * 删除策略信息
     * @param id
     * @returns {*}
     */
    deleteStragety: function*(data) {
       return yield db.update('stragety', data, {is_abolished: true});
        // return result;
    },
    /**
     * 更新策略信息
     * @param id
     * @returns {*}
     */
    updateStragety: function*(data, where) {
        var result =  yield db.update('stragety', where, data);
        //更新server信息，把uids、urls和策略id更新到server记录里
        // if(result){
        //     var servers = data.stra_servers.split(';')
        //     var urls = data.stra_urls.split(';')
        //     var uids = data.stra_uids.split(';')
        //     var otherwhere = {key: 'ip', opt: 'in', data: servers}
        //     var data = {urls: urls.join(';'), uids: uids.join(';')}
        //     result =  yield server_service.updateWebServer(data, undefined, [otherwhere], 'add')
        // }
        return result;
    },
    /**
     * 取出num个tag
     * @param num
     */
    getTags: function*(num){
        var tags =  yield db.get('tag', undefined, [{opt: 'noEqual', key:'tag_status', data: 'used'},{'limit': num}]);
        return tags.map((tag)=>{
            return {
                tag_id: tag.get('objectId'),
                tag_value: tag.get('value')
            }
        })
    },
    /**
     * 更新已使用的tag状态为used
     * @param tags_used
     */
    updateTags: function* (tags_used) {
        return yield db.update('tag', undefined, [{opt: 'in', key: 'objectId', data: tags_used}], {'tag_status': 'used'});
    },
    /**
     *  生成新版本（策略快照）
     * @param snapcode
     * @param tgid
     * @returns {string}
     */
    generateSnap: function* (snapcode, tgid) {
        //获取测试项目下所有的策略
        var result = '';

        var stragetylist =  yield db.get('stragety',{tgid: tgid},  [{opt: 'equal', key: 'is_abolished', data: false}]);
        var i = 0, len = stragetylist.length;
        for(;i<len;i++){
            var stragegty = stragetylist[i];
            //复制并更新snapcode字段，把is_abolished字段设置为false
            var data = {
                stra_name: stragegty.get('stra_name'),
                stra_desc: stragegty.get('stra_desc'),
                stra_cities: stragegty.get('stra_cities'),
                stra_servers: stragegty.get('stra_servers'),
                stra_serverskey: stragegty.get('stra_serverskey'),
                stra_urls: stragegty.get('stra_urls'),
                stra_uids: stragegty.get('stra_uids'),
                stra_status: stragegty.get('stra_status'),
                tgid: stragegty.get('tgid'),
                slbid: stragegty.get('slbid'),
                type: stragegty.get('type'),
                is_abolished: false,
                flowaccounting: stragegty.get('flowaccounting'),
                time: stragegty.get('time'),
                snapcode : snapcode
            }
            //把之前的is_abolished字段设置为true
            result = yield db.update('stragety', {objectId:stragegty.id }, {is_abolished: true});
            result = yield db.save('stragety', data);

        }
        return result;
    },
    /**
     * 切换回滚目标版本下的策略的is_abolished=false, 当前版本为true
     * @param snapcode
     * @param tgid
     * @returns {string}
     */
    changeStragetySnap: function* (oldSnapcode, newSnapcode, tgid) {
        var result = yield db.update('stragety', {tgid: tgid, snapcode: oldSnapcode }, {is_abolished: true});
        result =  yield db.update('stragety', {tgid: tgid, snapcode: newSnapcode }, {is_abolished: false});
        return result;
    }
}