var request = require('./request')
const uuid = require('uuid/v1');
module.exports = {
    saveSlb: function*(name) {
        var data = {
            name: name,
            uuid: uuid(),
            type: 'menu'
        }
        var result = yield request.post(data)
        return result;
    },
    getSlbList: function*() {
        var slblist = yield request.get({type: 'menu'});
        return slblist;
    },
    deleteSlb: function*(id) {
        var result = yield request.delete(id);
        return result;
    }
}