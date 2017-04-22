/**
 * 用途： 版本日志服务入口
 * 应提供功能： 版本日志的查询、生成功能
 * 开发者：刘伟东
 * Created by lwd426 on 17/4/13.
 */

var db = require('../../datasource/parse')
const uuid = require('uuid/v1');
var lib = require('../versionlog')
var libStra = require('../stragety')

module.exports = {
    /**
     * 获取版本日志列表
     * 版本发布时所有状态的策略（根据snapcode）
     * @returns {*}
     */
    getVersionlogList: function*(tgid) {
        if(tgid){
            var versionloglist = yield db.get('tgVersion', {tgid: tgid},[{opt:'desc', key: 'publishtime'}]);
            var i = 0, len = versionloglist.length;
            for(;i<len;i++){
                var version = versionloglist[i];
                var stragety_list = yield libStra.getStragetyInfos({tgid: tgid, snapcode: version.get('snapcode')})
                var details = []
                stragety_list.map((stragety)=>{
                    details.push({
                        name: stragety.get('stra_name') || '',
                        status: stragety.get('stra_status') || '',
                        urlArray: stragety.get('stra_urls') || [],
                        uidArray: stragety.get('stra_uids') || [],
                        regionArray: stragety.get('stra_cities') || [],
                        serverArray: stragety.get('stra_servers') || [],
                        default: stragety.get('refer') || false
                    })
                })
                version.set('details', details);
            }
            return versionloglist;
        }else{
            return {
                status: 'failure',
                info: '没有测试组id参数'
            }
        }
    },
    getVersionlog: function*(tgid, versionkey) {
        if(tgid){
            var versionloglist = yield db.get('tgVersion', {tgid: tgid, objectId: versionkey});
            return versionloglist;
        }else{
            return {
                status: 'failure',
                info: '没有测试组id参数'
            }
        }
    },
    updateVersionlog: function*(data, where) {
        return yield db.update('tgVersion', where, data);
    }
}