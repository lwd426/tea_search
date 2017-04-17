/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../datasource/parse')
const uuid = require('uuid/v1');
// var parseJson = require('json-superparser');
var libStragety = require('../stragety')
var libVersion = require('../versionlog')
var libVirtualHost = require('../virtualhost')
var moment = require('moment')

var libNginx = require('../../../lib/nginx')

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
    publish: function* (slbid, tgid, versionnum, versiondesc) {
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
             default: true
         }
         ]
         */
        var data = [],data4log = [];
        stragetylist.map((stragety)=>{
            if(stragety.get('stra_status') === 'running') {

                var temp = {
                    urlArray: [],
                    uidArray: [],
                    regionArray: [],
                    serverArray: [],
                    default: false
                }, temp4log = {
                    name: '',
                    status: '',
                    urlArray: [],
                    uidArray: [],
                    regionArray: [],
                    serverArray: [],
                    default: false
                };
                var urls = stragety.get("stra_urls") ? stragety.get("stra_urls").split(";") : [],
                    uids = stragety.get("stra_uids") ? stragety.get("stra_uids").split(";") : [],
                    cities = stragety.get("stra_cities") ? stragety.get("stra_cities").split(";") : [],
                    servers = stragety.get("stra_servers") ? stragety.get("stra_servers").split(";") : [],
                    isdefault = stragety.get("is_default") || false;

                temp.urlArray = urls;
                temp.uidArray = uids;
                temp.regionArray = cities;
                temp.serverArray = servers;
                temp.default = isdefault;
                data.push(temp)
                temp4log.urlArray = urls;
                temp4log.uidArray = uids;
                temp4log.regionArray = cities;
                temp4log.serverArray = servers;
                temp4log.default = isdefault;
                temp4log.name = stragety.get('stra_name') || '';
                temp4log.status = stragety.get('stra_status') || '';
                data4log.push(temp4log)
            }
        })
        //调用禚永然的配置文件生成接口
        // var conf = libNginx(data);
        //调用slb推送服务
        // yield libVirtualHost.updateSlbConfig(conf)
        //保存发版信息
        var version = {
            publishtime: moment().format('YYYY-MM-DD hh:mm:ss'),
            versiondesc: versiondesc,
            versionnum: versionnum,
            details:  JSON.stringify(data4log),
            slbid: slbid,
            tgid: tgid
        }
        // console.log(JSON.stringify(version.details))
        return yield db.save('tgVersion', version)

        //发送
    },
    publishBack: function* (slbid, tgid, versionkey) {
        //获取slb所有的策略信息（除了回滚的策略组）
        var stragetylist = yield libStragety.getStragetyList({slbid: slbid}, [{opt: 'noEqual', key: 'tgid', data: tgid}]);
        //获取回滚策略组的版本信息
        var stragetylistOfTg = yield libVersion.getVersionlog(tgid , versionkey);
        stragetylistOfTg = stragetylistOfTg[0];
        //循环策略列表，生成指定数据结构
        var data = [];
        stragetylist.map((stragety)=> {
            if(stragety.get('stra_status') === 'running'){
                var temp = {
                    urlArray: [],
                    uidArray: [],
                    regionArray: [],
                    serverArray: [],
                    default: false
                };
                temp.urlArray = stragety.get("stra_urls") ? stragety.get("stra_urls").split(";") : [],
                    temp.uidArray = stragety.get("stra_uids") ? stragety.get("stra_uids").split(";") : [],
                    temp.regionArray = stragety.get("stra_cities") ? stragety.get("stra_cities").split(";") : [],
                    temp.serverArray = stragety.get("stra_servers") ? stragety.get("stra_servers").split(";") : [],
                    temp.default = stragety.get("is_default") || false;
                data.push(temp)
            }
        });
        //循环被回滚项
        var backtgDetails = JSON.parse(stragetylistOfTg.get('details')) || [];
        //拼接获得该slb下所有的策略组信息
        var data = data.concat(backtgDetails);

        //调用禚永然的接口生成新的配置文件
        // var conf = libNginx(data);
        //调用slb推送服务
        // yield libVirtualHost.updateSlbConfig(conf)

        //更新该被回滚的策略组的发布时间为当前时间，其他信息不变
        var result = yield libVersion.updateVersionlog({'publishtime': moment().format('YYYY-MM-DD hh:mm:ss')},{'objectId':stragetylistOfTg.id })
        return result;
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