/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var db = require('../../db')
const uuid = require('uuid/v1');
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