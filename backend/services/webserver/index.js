/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../datasource/parse')
var moment = require('moment');

module.exports = {
    saveWebServer: function*(key, slbid, ip, address, backup, refer) {
        var data = {
            key: key, 
            slbid: slbid, 
            ip: ip, 
            address: address,
            backup: backup,
            refer: refer,
            time: moment().format('YYYY-MM-DD HH:mm'),
        }

        var result = yield db.save('webServer', data)
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
     * 获取WebServer列表
     * @returns {*}
     */
    getWebServerList: function*(slbid) {
        var list = yield db.get('webServer', {slbid: slbid}, [{opt: 'desc', key: 'createdAt'}]);
        var len = list.length, i=0;
        for(;i<len;i++){
            var server = list[i];
            var serverkey = server.get('key');
            var listofstragety = yield db.get('stragety', {slbid: slbid, is_abolished: false});
            var k=0,len2 = listofstragety.length, stras = [];
            for(;k<len2;k++){
                var stragety = listofstragety[k];
                if(stragety.get('stra_serverskey').indexOf(serverkey)!==-1){
                    var tg = yield db.get('testgroup', {objectId: stragety.get('tgid')});
                    stras.push({
                        stra_name: stragety.get("stra_name"),
                        stra_id: stragety.get("stra_id"),
                        stra_servers: stragety.get("stra_servers"),
                        stra_status: stragety.get("stra_status"),
                        tg_name: tg[0].get('name'),
                        tg_id: tg[0].id
                    })
                }

            }
            server.set('strageties', stras)

        }
        return list;
    },
    /**
     * 删除WebServer信息
     * @param id
     * @returns {*}
     */
    deleteWebServer: function*(slbid, data) {
        //先查询要删除的server，如果server下有策略，则不能删除，返回信息：提示用策略正在运行，请先删除
        var result = {
            status: 'failure',
            info: ''
        }
        var server = yield db.get('webServer', data);
        var serverkey = server[0].get('key');
        var listofstragety = yield db.get('stragety', {slbid: slbid});
        var k=0,len2 = listofstragety.length, stras = '';
        for(;k<len2;k++){
            var stragety = listofstragety[k];
            if(stragety.get('stra_serverskey').indexOf(serverkey)!==-1){
                var tg = yield db.get('testgroup', {objectId: stragety.get('tgid')});
                stras += stragety.get("stra_name") + ' ' ;
            }

        }
        if(server[0].get('stragetiesinfo')){
            result.info = "不能删除该服务器（该服务器部署了以下几个策略：" + stras
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
        if(!otherwhere) otherwhere = []
        return yield db.get('webServer', where, otherwhere);
    }
}