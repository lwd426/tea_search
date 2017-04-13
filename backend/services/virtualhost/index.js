/**
 * 用途： 与slb服务沟通接口
 * 应提供功能：
 * 开发者：刘伟东
 * Created by lwd426 on 17/4/13.
 */

var db = require('../../datasource/virtualhost')

module.exports = {
    /**
     * 通过域名name获取域名id
     * 必要参数: name  域名（例如： m.le.com）
     * @returns
     * {  data: [2101],
          result: 200
          }
     */
    getByName: function*(name) {
        var data = yield db.get(name);
        return data;
    },
}