// var ParseUtils = require('./utils');
//
// module.exports = {
//     save: function *(data){
//         var Menu = ParseUtils.initObject('Menu');
//         var result = yield ParseUtils.save(Menu, data);
//         return result;
//     },
//     get: function* (data){
//         var Quwey = ParseUtils.initQuery('Menu');
//         Quwey.equalTo("type", data.type);
//         return yield ParseUtils.get(Quwey, data);
//     },
//     delete: function* (data){
//         var Quwey = ParseUtils.initQuery('Menu');
//         Quwey.equalTo("type", data.type);
//         return yield ParseUtils.get(Quwey, data);
//     }
// }
//
//
//
//
//
//
