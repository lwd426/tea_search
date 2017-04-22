var router = require('koa-router')();
const testgroup = require('./testgroup');
const slb = require('./slb');
const stragety = require('./stragety');
const webserver = require('./webserver');
//const cha = require('./cha');
const city = require('./city');
const virtualhost = require('./virtualhost');
const versionlog = require('./versionlog');
const charts = require('./charts');


router.use('/slb', slb.routes(), slb.allowedMethods());
router.use('/testgroup', testgroup.routes(), testgroup.allowedMethods());
router.use('/stragety', stragety.routes(), stragety.allowedMethods());
router.use('/webserver', webserver.routes(), webserver.allowedMethods());
//router.use('/cha', cha.routes(), cha.allowedMethods());
router.use('/city', city.routes(), city.allowedMethods());
router.use('/virtualhost', virtualhost.routes(), virtualhost.allowedMethods());
router.use('/versionlog', versionlog.routes(), versionlog.allowedMethods());
router.use('/charts', charts.routes(), charts.allowedMethods());

// router.get('/', function *(next) {
//     console.log('////')
//   yield this.render('index', {
//     title: 'Hello World Koa!'
//   });
// });

module.exports = router;
