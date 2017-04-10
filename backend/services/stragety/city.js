/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../db')

module.exports = {
    /**
     * 获取策略列表
     * @returns {*}
     */
    getCities: function*() {
        var list = yield db.get('city');
        return list;
    },
}