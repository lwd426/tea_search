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
    getByName: function*(domianName) {
        var result = yield db.get('getbyname/' + domianName);
        if(result.result === 200){
            return {
                status: 'success',
                data:result.data[0]
            }
        }else{
            return {
                status: 'failure',
                data: '不合法，请咨询相关人员'
            }
        }
    },
    // /**
    //  * 新增slb
    //  * @param content
    //  * @returns {*}
    //  */
    // postSlbConfig: function *(content) {
    //     return yield db.post('', content)
    // },
    /**
     * 获取指定域名id的配置文件
     * @param domainId
     * @returns {*}
     */
    getSlbConfig: function *(domainId) {
        return yield db.post('content/', domainId)
    },
    /**
     * 更新指定域名的slb配置文件
     * @param domainId
     * @param content
     * @returns {*}
     */
    updateSlbConfig: function *(domainId, content) {
        return yield db.update('manual/'+ domainId, content)
    }
}