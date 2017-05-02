var router = require('koa-router')();
var lib = require('../cha/api')
var rq = require('../cha/request')
var url =  'http://api.map.baidu.com/place/v2/search'
var ak =  'oiEutVru1rnLPMj2USktYVFLM6BPijf3'
// ,,39.892632,116.344744
function isInteger(obj) {
    return Math.floor(obj) === obj
}
router.get('/', function *(next) {
    // 0-99
    //100 - 300
    var latitude_start = 39780975;
    var longitude_start = 116169667;
    var latitude_step = 37219;
    var longitude_step = 58359;
    var lat_fenttai = 3985541300;
    var long_fenttai = 11628638500;
    var lat_fengtai_step = 930475;
    var long_fengtai_step = 1458975;

    var data = {
        query: '茶叶店',
        region: '北京',
        city_limit: true,
        output: 'json',
        scope: 2,
        ak : ak,
        page_size: 20,
        page_num: 0
    }
    var data4bounds = {
        query: '茶',
        bounds: '39.899106,116.468516,39.968097,116.537505',
        city_limit: true,
        output: 'json',
        scope: 2,
        ak : ak,
        page_size: 20,
        page_num: 0
    }
    var results = []
    var i = 1,lat_len=8,long_len = 8;
    // var i = 1,lat_len=4,long_len = 4;
    for(;i<=lat_len;i++){
        var l = 1;
        for(;l<=long_len;l++){
            var lat_start = ((latitude_start + latitude_step * (i-1))/1000000).toFixed(6);
            var long_start = ((longitude_start + longitude_step * (l-1))/1000000).toFixed(6);
            var lat_end = ((latitude_start + latitude_step * i)/1000000).toFixed(6);
            var long_end = ((longitude_start + longitude_step * l)/1000000).toFixed(6);
            // var lat_start = ((lat_fenttai + lat_fengtai_step * (i-1))/100000000).toFixed(6);
            // var long_start = ((long_fenttai + long_fengtai_step * (l-1))/100000000).toFixed(6);
            // var lat_end = ((lat_fenttai + lat_fengtai_step * i)/100000000).toFixed(6);
            // var long_end = ((long_fenttai + long_fengtai_step * l)/100000000).toFixed(6);
            data4bounds.bounds = lat_start+','+long_start+','+lat_end+','+long_end;
            data4bounds.page_num = 0;
            var result =  yield rq.search(url,data4bounds);
            results = results.concat(result.results)

            var sum =  result.total;
            var pagesum =  Math.ceil(sum/20);
            console.log(data4bounds.bounds+ ' : ' + sum + ' : ' + pagesum);
            for(var k = 1; k<pagesum; k++){
                data4bounds.page_num = k;
                var result2 =  yield rq.search(url,data4bounds);
                console.log(result2.results.length)
                results = results.concat(result2.results)
            }
        }


    }
    var filepath = yield lib.save(results);
    this.body = filepath;
    this.body = {
        status: 'success',
        data: filepath || ''
    };
});

/**
 * 6环，12✖12，共214个方块
 * 左下坐标：116.040347,39.716082
 * 右上坐标：116.84063,40.34984
 * 纬度步长：0.05281317
 * 经度步长：0.06669025
 */
router.get('/six', function *(next) {
    var data4bounds = {
        query: '茶庄',
        bounds: '',
        city_limit: false,
        output: 'json',
        scope: 2,
        ak : ak,
        page_size: 20,
        page_num: 0
    }
    var latitude_start = 3971608200;
    var longitude_start = 11604034700;
    var latitude_step = 5281317;
    var longitude_step = 6669025;
    var filepath = yield excute(
        latitude_start,
        longitude_start,
        latitude_step,
        longitude_step,
        12,
        12,
        100000000,
        data4bounds)
    this.body = filepath;
    this.body = {
        status: 'success',
        data: filepath || ''
    };
});

function* excute(latitude_start, longitude_start, latitude_step, longitude_step, lat_sum, long_sum, tens, data4bounds){
    var results = []
    var i = 1,lat_len=lat_sum,long_len = long_sum;
    for(;i<=lat_len;i++){
        var l = 1;
        for(;l<=long_len;l++){
            var lat_start = ((latitude_start + latitude_step * (i-1))/tens).toFixed(6);
            var long_start = ((longitude_start + longitude_step * (l-1))/tens).toFixed(6);
            var lat_end = ((latitude_start + latitude_step * i)/tens).toFixed(6);
            var long_end = ((longitude_start + longitude_step * l)/tens).toFixed(6);
            data4bounds.bounds = lat_start+','+long_start+','+lat_end+','+long_end;
            data4bounds.page_num = 0;
            var result =  yield rq.search(url,data4bounds);
            results = results.concat(result.results)

            var sum =  result.total;
            var pagesum =  Math.ceil(sum/20);
            console.log(data4bounds.bounds+ ' : ' + sum + ' : ' + pagesum);
            for(var k = 1; k<pagesum; k++){
                data4bounds.page_num = k;
                var result2 =  yield rq.search(url,data4bounds);
                results = results.concat(result2.results)
            }
        }


    }
    var filepath = yield lib.save(results);
    return filepath
}
module.exports = router;