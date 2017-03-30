var db = require('../../db/request')
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
        var result = yield db.save(data)
        return result;
    },
    /**
     * 获取slb列表
     * @returns {*}
     */
    getSlbList: function*() {
        var slblist = yield db.search({type: 'menu'});
        return slblist;
    },
    /**
     * 删除slb信息
     * @param id
     * @returns {*}
     */
    deleteSlb: function*(id) {
        var result = yield db.delete(id);
        return result;
    }
}