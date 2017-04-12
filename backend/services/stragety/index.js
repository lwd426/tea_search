/**
 * 用途： 策略维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../db')
const uuid = require('uuid/v1');
var moment = require('moment');
var server_service = require('../webserver')

module.exports = {
    /**
     * 保存策略信息
     * @param name
     * @returns {*}
     */
    saveStragety: function*(uuid, slbid,tgid,name,desc,cities,servers,serverskey,urls,uid,type) {
        //保存策略
        var data = {
            stra_id : uuid,
            stra_name: name,
            stra_desc: desc,
            stra_cities: cities.join(';'),
            stra_servers: servers.join(';'),
            stra_serverskey: serverskey.join(';'),
            stra_urls: urls.join(';'),
            stra_uids: uids.join(';'),
            stra_status: 'new',
            tgid: tgid,
            slbid: slbid,
            type: type,
            flowaccounting: '未配置',
            time: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        var result = yield db.save('stragety', data);
        //更新server信息，把uids、urls和策略id更新到server记录里
        if(result){
            var otherwhere = {key: 'ip', opt: 'in', data: servers}
            var data = {urls: urls.join(';'), uids: uids.join(';'), stragetiesinfo: uuid}
            var result2 =  yield server_service.updateWebServer(data, undefined, [otherwhere], 'add')
        }
        return result && result2;
    },
    /**
     * 获取策略列表
     * @returns {*}
     */
    getStragetyList: function*(opts) {
        var stragetylist =  yield db.get('stragety',opts);
        //为了与web服务器的增删改查一致，所以策略的基准以服务器的key为准
        var i=0; len=stragetylist.length;
        for(;i<len;i++){
            var stragety = stragetylist[i]
            var serverskey = stragety.get("stra_serverskey").split(";");
            var servers = yield server_service.getServersInfo(undefined, [{opt: 'in', key:'key', data: serverskey}])
            var serversinfo = [];
            servers.map((server)=>{
                if(server.get('ip') && server.get('ip')!== '')  serversinfo.push(server.get('ip'));
            })
            stragety.set("stra_servers",serversinfo.join(';'));
        }


        return stragetylist;
    },
    /**
     * 删除策略信息
     * @param id
     * @returns {*}
     */
    deleteStragety: function*(data) {
       return yield db.delete('stragety', data);
        // return result;
    },
    /**
     * 更新策略信息
     * @param id
     * @returns {*}
     */
    updateStragety: function*(data, where) {
        return yield db.update('stragety', where, data);
        // return result;
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
    }
}