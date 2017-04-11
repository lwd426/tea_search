/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../db')
const uuid = require('uuid/v1');
var libStragety = require('../stragety')

module.exports = {
    /**
     * 保存slb信息
     * @param name
     * @returns {*}
     */
    saveSlb: function*(name) {
        var data = {
            name: name,
            uuid: uuid(),
            type: 'menu'
        }
        var result = yield db.save('slb', data)
        return result;
    },
    /**
     *
     * @param slbid
     */
    publish: function* (slbid) {
        //获取slb所有的信息
        var stragetylist = yield libStragety.getStragetyList({slbid: slbid})
        //循环策略列表，生成指定数据结构
        /**
         * [
         {
             urlArray:['http://m.le.com/vplay_12.html',...],
             uidArray:['3323444',...],
             regionArray: ['Beijing','Tianjin'...],
             serverArray:['192.168.1.2',..],
             isSpecial: true
         }
         ]
         */
        var data = [];
        stragetylist.map((stragety)=>{
            var temp = {
                urlArray: [],
                uidArray: [],
                regionArray: [],
                serverArray: [],
                default: false
            };
            var urls = stragety.get("stra_urls") ? stragety.get("stra_urls").split(";") : [],
                uids = stragety.get("stra_uids")  ? stragety.get("stra_uids").split(";") : [],
                cities = stragety.get("stra_cities") ? stragety.get("stra_cities").split(";") :  [],
                servers = stragety.get("stra_servers")  ? stragety.get("stra_servers").split(";") :  [],
                isdefault = stragety.get("is_default") || false;

            temp.urlArray = urls;
            temp.uidArray = uids;
            temp.regionArray = cities;
            temp.serverArray = servers;
            temp.default = isdefault;
            data.push(temp)
        })
        console.log(data)
        //调用禚永然的配置文件生成接口

        //发送
    },
    /**
     * 获取slb列表
     * @returns {*}
     */
    getSlbList: function*(id) {
        if(id){
            var slblist = yield db.get('slb', {objectId: id});
            return slblist;
        }else{
            var slblist = yield db.get('slb');
            return slblist;
        } 
    },
    /**
     * 删除slb信息
     * @param id
     * @returns {*}
     */
    deleteSlb: function*(id) {
        var result = yield db.delete('slb', {objectId: id});
        return result;
    },
    /**
     * 删除slb信息
     * @param id
     * @returns {*}
     */
    updateSlb: function*(where, data) {
        var result = yield db.update('slb', where, data);
        return result;
    }
}