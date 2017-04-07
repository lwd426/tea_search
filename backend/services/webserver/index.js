/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../db')
var moment = require('moment');

module.exports = {
    saveWebServer: function*(key, slbid, ip, stragetyname, address, backup, refer) {
        var data = {
            key: key, 
            slbid: slbid, 
            ip: ip, 
            stragetyname: stragetyname,
            address: address,
            backup: backup,
            refer: refer,
            time: moment().format('YYYY-MM-DD HH:mm'),
        }
        // { key:1, id: 1, name: '按照按钮测试', status: 'running', flowaccounting: '未配置',  time:'2017-03-29 10:00:00',version: 'v1.0.0'}

        var result = yield db.save('webServer', data)
        return result;
    },
    /**
     * 获取WebServer列表
     * @returns {*}
     */
    getWebServerList: function*(slbid) {
        var list = yield db.get('webServer', {slbid: slbid});
        var len = list.length, i=0;
        for(;i<len;i++){
            var server = list[i];
            var listofstragety = '';
            var stragetiesinfo = server.get('stragetiesinfo') ;
            if(!stragetiesinfo || stragetiesinfo.split(';').length === 0) {
                listofstragety = [];
            }else{
                listofstragety = yield db.get('stragety', {slbid: slbid}, undefined, {key: 'stra_id', opt: 'in', data: stragetiesinfo.split(';')});
            }
            server.set('stragetiesinfo', listofstragety)
        }
        return list;
    },
    /**
     * 删除WebServer信息
     * @param id
     * @returns {*}
     */
    deleteWebServer: function*(data) {
        var result = yield db.delete('webServer', data);
        return result;
    },
    /**
     * 删除WebServer信息
     * @param id
     * @returns {*}
     */
    updateWebServer: function*(data, where, otherwhere) {
        var result = yield db.update('webServer', where, data, otherwhere);
        return result;
    }
}