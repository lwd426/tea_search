var request = require('./request')
const uuid = require('uuid/v1');
module.exports = {
    saveMenu: function*(name) {
        var data = {
            name: name,
            uuid: uuid(),
            type: 'menu'
        }
        var result = yield request.post(data)
        return result;
    },
    getMenuList: function*() {
        var menulist = yield request.get({type: 'menu'});
        return menulist;
    },
    deleteMenu: function*(id) {
        var result = yield request.delete(id);
        return result;
    }
}