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
    saveStragety: function*(uuid, slbid,tgid,name,desc,cities,servers,urls,uids) {
        //保存策略
        var data = {
            stra_id : uuid,
            stra_name: name,
            stra_desc: desc,
            stra_cities: cities.join(';'),
            stra_servers: servers.join(';'),
            stra_urls: urls.join(';'),
            stra_uids: uids.join(';'),
            stra_status: 'new',
            tgid: tgid,
            slbid: slbid,
            flowaccounting: '未配置',
            time: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        var result = yield db.save('stragety', data);
        //更新server信息，把uids、urls和策略id更新到server记录里
        if(result){
            var otherwhere = {key: 'ip', opt: 'in', data: servers}
            var data = {urls: urls.join(';'), uids: uids.join(';')}
            var result2 =  yield server_service.updateWebServer(data, undefined, otherwhere)
        }
        return result && result2;
    },
    /**
     * 获取策略列表
     * @returns {*}
     */
    getStragetyList: function*(opts) {
        var list = yield db.get('stragety',opts);
        return list;
    },
    /**
     * 删除策略信息
     * @param id
     * @returns {*}
     */
    deleteStragety: function*(data) {
        var result = yield db.delete('stragety', data);
        return result;
    },
    /**
     * 更新策略信息
     * @param id
     * @returns {*}
     */
    updateStragety: function*(data, where) {
        var result = yield db.update('stragety', where, data);
        return result;
    }
}