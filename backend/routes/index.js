var router = require('koa-router')();
const testgroup = require('./testgroup');
const slb = require('./slb');
const stragety = require('./stragety');
const webserver = require('./webserver');


router.use('/slb', slb.routes(), slb.allowedMethods());
router.use('/testgroup', testgroup.routes(), testgroup.allowedMethods());
router.use('/stragety', stragety.routes(), stragety.allowedMethods());
router.use('/webserver', webserver.routes(), webserver.allowedMethods());

// router.get('/', function *(next) {
//     console.log('////')
//   yield this.render('index', {
//     title: 'Hello World Koa!'
//   });
// });

module.exports = router;
