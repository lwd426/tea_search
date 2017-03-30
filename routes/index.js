var router = require('koa-router')();
const slb = require('./slb');


router.use('/slb', slb.routes(), slb.allowedMethods());

// router.get('/', function *(next) {
//     console.log('////')
//   yield this.render('index', {
//     title: 'Hello World Koa!'
//   });
// });

module.exports = router;
