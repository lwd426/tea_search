/**
 * 用途： 版本日志服务入口
 * 应提供功能： 版本日志的查询、生成功能
 * 开发者：刘伟东
 * Created by lwd426 on 17/4/13.
 */

var db = require('../../datasource/parse')
const uuid = require('uuid/v1');
var lib = require('../versionlog')

module.exports = {
    /**
     * 获取版本日志列表
     * @returns {*}
     */
    getVersionlogList: function*(tgid) {
        if(tgid){
            var versionloglist = yield db.get('versionlog', {tgid: tgid});
            return versionloglist;
        }else{
            return {
                status: 'failure',
                info: '没有测试组id参数'
            }
        }
    }
}