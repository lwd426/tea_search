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
var libServer = require('../webserver')
var libVirtualHost = require('../virtualhost')
var moment = require('moment')

var libNginx = require('../../../lib/nginx')

module.exports = {
    /**
     * 保存slb信息
     * @param name
     * @returns {*}
     */
    saveSlb: function*(name, domain, domainId) {
        var data = {
            name: name,
            slbDomain: domain,
            domainId: domainId,
            uuid: uuid(),
            type: 'menu'
        }
        var result = yield db.save('slb', data)
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
     *
     * @param slbid
     */
    publish: function* (domainId, slbid, tgid, versionnum, versiondesc) {
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
        var referServers = yield libServer.getServersInfo({slbid: slbid}, [{opt: 'noExist', key: 'stragetiesinfo'}])
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
                var urls = stragety.get("stra_urls") ? stragety.get("stra_urls") : [],
                    uids = stragety.get("stra_uids") ? stragety.get("stra_uids") : [],
                    cities = stragety.get("stra_cities") ? stragety.get("stra_cities") : [],
                    servers = stragety.get("stra_servers") ? stragety.get("stra_servers") : [],
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
        });
        var serverdata = {
            urlArray: ['/'],
            uidArray:[],
            regionArray: [],
            serverArray: [],
            default: true
        };


        referServers.map((server)=>{
            serverdata.serverArray.push(server.get('ip'))
        })

        data.push(serverdata)
        console.log(data)
        //调用禚永然的配置文件生成接口
        // var conf = libNginx(data);
        //调用slb推送服务
        // yield libVirtualHost.updateSlbConfig(conf)


        //调用禚永然的接口生成新的配置文件
        var confResult = libNginx(data);
        var result = '';
        if(confResult.code === 0) {
            //调用slb推送服务
            result = yield libVirtualHost.updateSlbConfig(domainId, confResult.content);
            //错误判断
            if(result.status === 'failure') {
                return result;
            }
        }else{
            result = {
                status: 'failure',
                info: confResult.data
            }
            return result;
        }
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
        var result = yield db.save('tgVersion', version);
        if(result){
            result = {
                status: 'success',
                stra_info: versionnum + '-' + versiondesc
            }
        }
        return result;

        //发送
    },
    publishBack: function* (domainId,slbid, tgid, versionkey) {
        //获取slb所有的策略信息（除了回滚的策略组）
        var stragetylist = yield libStragety.getStragetyList({slbid: slbid}, [{opt: 'noEqual', key: 'tgid', data: tgid}]);
        var referServers = yield libServer.getServersInfo({slbid: slbid}, [{opt: 'noExist', key: 'stragetiesinfo'}])
        console.log(referServers.length)

        //获取回滚策略组的版本信息
        var version = yield libVersion.getVersionlog(tgid , versionkey);
        version = version[0];
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
                temp.urlArray = stragety.get("stra_urls") ? stragety.get("stra_urls") : [],
                    temp.uidArray = stragety.get("stra_uids") ? stragety.get("stra_uids") : [],
                    temp.regionArray = stragety.get("stra_cities") ? stragety.get("stra_cities") : [],
                    temp.serverArray = stragety.get("stra_servers") ? stragety.get("stra_servers") : [],
                    temp.default = stragety.get("is_default") || false;
                data.push(temp)
            }
        });
        //循环被回滚项
        var backtgDetails = JSON.parse(version.get('details')) || [];
        //拼接获得该slb下所有的策略组信息
        var data = data.concat(backtgDetails);

        var serverdata = {
            urlArray: ['/'],
            uidArray:[],
            regionArray: [],
            serverArray: [],
            default: true
        };


        referServers.map((server)=>{
            serverdata.serverArray.push(server.ip)
        })

        data.push(serverdata)
        //调用禚永然的接口生成新的配置文件
        var confResult = libNginx(data);
        var result = '';
        if(confResult.code === 0) {
            //调用slb推送服务
            result = yield libVirtualHost.updateSlbConfig(domainId,confResult.content);
            //错误判断
            if(result.status === 'failure') {
                return result;
            }
        }else{
            result = {
                status: 'failure',
                info: confResult.data
            }
            return result;
        }

        //更新该被回滚的策略组的发布时间为当前时间，其他信息不变
        result = yield libVersion.updateVersionlog({'publishtime': moment().format('YYYY-MM-DD hh:mm:ss')},{'objectId':version.id })
        if(result){
            result = {
                status: 'success',
                stra_info: version.get('versionnum') + '-' + version.get('versiondesc')
            }
        }
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