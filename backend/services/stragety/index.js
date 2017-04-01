/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../db')
const uuid = require('uuid/v1');
var moment = require('moment');

module.exports = {
    /**
     * 保存策略信息
     * @param name
     * @returns {*}
     */
    saveStragety: function*(name, code, slbid) {
        var data = {
            name: '请输入',
            code: code,
            slbid: slbid,
            status: '新上',
            flowaccounting: '未配置',
            time: moment().format('YYYY-MM-DD HH:mm'),
            version: '-'

        }
        // { key:1, id: 1, name: '按照按钮测试', status: 'running', flowaccounting: '未配置',  time:'2017-03-29 10:00:00',version: 'v1.0.0'}

        var result = yield db.save('testgroup', data)
        return result;
    },
    /**
     * 获取策略列表
     * @returns {*}
     */
    getStragetyList: function*() {
        var list = yield db.get('testgroup',{tgid: tgid});
        return list;
    },
    /**
     * 删除策略信息
     * @param id
     * @returns {*}
     */
    deleteStragety: function*(data) {
        var result = yield db.delete('testgroup', data);
        return result;
    },
    /**
     * 更新策略信息
     * @param id
     * @returns {*}
     */
    updateStragety: function*(data, where) {
        var result = yield db.update('testgroup', where, data);
        return result;
    }
}