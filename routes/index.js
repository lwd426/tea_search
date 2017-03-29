var router = require('koa-router')();
const menu = require('./menu');


router.use('/menu', menu.routes(), menu.allowedMethods());

// router.get('/', function *(next) {
//     console.log('////')
//   yield this.render('index', {
//     title: 'Hello World Koa!'
//   });
// });

module.exports = router;
