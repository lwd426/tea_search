/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../datasource/parse')
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
                listofstragety = yield db.get('stragety', {slbid: slbid}, [{key: 'stra_id', opt: 'in', data: stragetiesinfo.split(';')}]);
            }
            var info = listofstragety.map((stragety)=>{
                return {
                    stra_name: stragety.get("stra_name"),
                    stra_id: stragety.get("stra_id"),
                    stra_servers: stragety.get("stra_servers"),
                    stra_status: stragety.get("stra_status")
                }
            })
            server.set('stragetiesinfo', info)
        }
        return list;
    },
    /**
     * 删除WebServer信息
     * @param id
     * @returns {*}
     */
    deleteWebServer: function*(data) {
        //先查询要删除的server，如果server下有策略，则不能删除，返回信息：提示用策略正在运行，请先删除
        var result = {
            status: 'failure',
            info: ''
        }
        var server = yield db.get('webServer', data);
        if(server[0].get('stragetiesinfo')){
            var stragetiesid = server[0].get('stragetiesinfo').split(';');
            var strageties = yield db.get('stragety', undefined, {key: 'in', key: 'stra_id', data: stragetiesid});
            var i = 0,len = strageties.length;
            var stra_info = [];
            for(;i<len;i++){
                var stragety = strageties[i];
                if(stragety !== ''){
                    stra_info.push(stragety.get('stra_name'));
                }
            }
            result.info = "不能删除该服务器（该服务器部署了以下几个策略：" + stra_info.join(' ')
        }else{
            var re = yield db.delete('webServer', data);
            result.status = 'success';
            result.info = '删除成功'
        }


        return result;
    },
    /**
     * 删除WebServer信息
     * @param data
     * @param where
     * @param otherwhere
     * @param type 是更新内容还是添加内容
     * @returns {*}
     */
    updateWebServer: function*(data, where, otherwhere, type) {
        var result = yield db.update('webServer', where, data, otherwhere, type);
        return result;
    },
    /**
     * 单纯的查询服务器基本信息
     * @param where
     * @param otherwhere
     */
    getServersInfo: function* (where,otherwhere) {
        return yield db.get('webServer', where, otherwhere);
    }
}