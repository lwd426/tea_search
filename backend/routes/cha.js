var router = require('koa-router')();
var lib = require('../cha/api')
var rq = require('../cha/request')
var co=require('co')

var url =  'http://api.map.baidu.com/place/v2/search'
var ak =  'oiEutVru1rnLPMj2USktYVFLM6BPijf3'
// ,,39.892632,116.344744
function isInteger(obj) {
    return Math.floor(obj) === obj
}
// router.get('/', function *(next) {
//     // 0-99
//     //100 - 300
//     var latitude_start = 39780975;
//     var longitude_start = 116169667;
//     var latitude_step = 37219;
//     var longitude_step = 58359;
//     var lat_fenttai = 3985541300;
//     var long_fenttai = 11628638500;
//     var lat_fengtai_step = 930475;
//     var long_fengtai_step = 1458975;
//
//     var data = {
//         query: '茶叶店',
//         region: '北京',
//         city_limit: true,
//         output: 'json',
//         scope: 2,
//         ak : ak,
//         page_size: 20,
//         page_num: 0
//     }
//     var data4bounds = {
//         query: '茶',
//         bounds: '39.899106,116.468516,39.968097,116.537505',
//         city_limit: true,
//         output: 'json',
//         scope: 2,
//         ak : ak,
//         page_size: 20,
//         page_num: 0
//     }
//     var results = []
//     var i = 1,lat_len=8,long_len = 8;
//     // var i = 1,lat_len=4,long_len = 4;
//     for(;i<=lat_len;i++){
//         var l = 1;
//         for(;l<=long_len;l++){
//             var lat_start = ((latitude_start + latitude_step * (i-1))/1000000).toFixed(6);
//             var long_start = ((longitude_start + longitude_step * (l-1))/1000000).toFixed(6);
//             var lat_end = ((latitude_start + latitude_step * i)/1000000).toFixed(6);
//             var long_end = ((longitude_start + longitude_step * l)/1000000).toFixed(6);
//             // var lat_start = ((lat_fenttai + lat_fengtai_step * (i-1))/100000000).toFixed(6);
//             // var long_start = ((long_fenttai + long_fengtai_step * (l-1))/100000000).toFixed(6);
//             // var lat_end = ((lat_fenttai + lat_fengtai_step * i)/100000000).toFixed(6);
//             // var long_end = ((long_fenttai + long_fengtai_step * l)/100000000).toFixed(6);
//             data4bounds.bounds = lat_start+','+long_start+','+lat_end+','+long_end;
//             data4bounds.page_num = 0;
//             var result =  yield rq.search(url,data4bounds);
//             results = results.concat(result.results)
//
//             var sum =  result.total;
//             var pagesum =  Math.ceil(sum/20);
//             // console.log(data4bounds.bounds+ ' : ' + sum + ' : ' + pagesum);
//             for(var k = 1; k<pagesum; k++){
//                 data4bounds.page_num = k;
//                 var result2 =  yield rq.search(url,data4bounds);
//                 // console.log(result2.results.length)
//                 results = results.concat(result2.results)
//             }
//         }
//
//
//     }
//     var filepath = yield lib.save(results);
//     this.body = filepath;
//     this.body = {
//         status: 'success',
//         data: filepath || ''
//     };
// });
//
// /**
//  * 6环，12✖12，共214个方块
//  * 左下坐标：116.040347,39.716082
//  * 右上坐标：116.84063,40.34984
//  * 纬度步长：0.05281317
//  * 经度步长：0.06669025
//  */
// router.get('/six', function *(next) {
//     var data4bounds = {
//         query: '茶庄',
//         bounds: '',
//         city_limit: false,
//         output: 'json',
//         scope: 2,
//         ak : ak,
//         page_size: 20,
//         page_num: 0
//     }
//     var latitude_start = 3971608200;
//     var longitude_start = 11604034700;
//     var latitude_step = 5281317;
//     var longitude_step = 6669025;
//     var filepath = yield excuteWithName(
//         latitude_start,
//         longitude_start,
//         latitude_step,
//         longitude_step,
//         12,
//         12,
//         100000000,
//         data4bounds)
//     this.body = filepath;
//     this.body = {
//         status: 'success',
//         data: filepath || ''
//     };
// });

function* excute(latitude_start, longitude_start, latitude_step, longitude_step, lat_sum, long_sum, tens, data4bounds){

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
            var results = [];
            var result =  yield rq.search(url,data4bounds);
            results = results.concat(result.results)

            var sum =  result.total;
            var pagesum =  Math.ceil(sum/20);
            for(var k = 1; k<=pagesum; k++){
                data4bounds.page_num = k;
                var result2 =  yield rq.search(url,data4bounds);
                results = results.concat(result2.results)
            }
            var bbox = data4bounds.bounds;
            var markers = '';
            var labels = '&labels=';
            var labelStyles = '&labelStyles=';
            console.log(bbox)
            if(results.length === 0){
                continue;
            }
            if(results.length <= 50){//如果50个点以内，则直接一张图
                results.map((point)=>{
                    if(point && point.name.indexOf('吴裕泰') ===-1 && point.name.indexOf('张一元') ===-1 && point.name.indexOf('茶楼') ===-1) {
                        markers += point.location.lng || '';
                        markers += ','
                        markers += point.location.lat || '';
                        markers += '|'
                    }
                })
                if(markers.length !== 0) {
                    var generagteImg = 'http://api.map.baidu.com/staticimage/v2?ak=oiEutVru1rnLPMj2USktYVFLM6BPijf3&width=1000&height=800&bbox='
                    generagteImg += bbox + '&markers=' + markers;
                    var filepath = yield lib.saveImg(generagteImg, i + '-' + l + '-' + Math.random().toString(36).slice(2, 8));
                }
            }else{//否则则生成几张图
                var step = 50;
                var step_num = Math.ceil(results.length/step);
                var yu = results.length%step;
                for(var h = 0; h< step_num ; h++){
                    var xx = step;
                    if(h === (step_num-1)){
                        xx = yu;
                    }
                    var markers = '';
                    for(var t = 0; t< xx ;t++){
                        var cell = results[h * 50 + t];
                        if(cell && cell.name.indexOf('吴裕泰') ===-1 && cell.name.indexOf('张一元') ===-1 && cell.name.indexOf('茶楼') ===-1) {

                            markers += cell.location.lng || '';
                            markers += ','
                            markers += cell.location.lat || '';
                            markers += '|'
                        }
                    }
                    if(markers.length !== 0) {
                        var generagteImg = 'http://api.map.baidu.com/staticimage/v2?ak=oiEutVru1rnLPMj2USktYVFLM6BPijf3&width=1000&height=800&bbox='
                        generagteImg += bbox + '&markers=' + markers;
                        var filepath = yield lib.saveImg(generagteImg, i + '-' + l + '-' + h + '-' + Math.random().toString(36).slice(2, 8));
                    }
                }

            }

        }

    }
    // var filepath = yield lib.save(results);
    // return filepath
}


function* excuteWithName(latitude_start, longitude_start, latitude_step, longitude_step, lat_sum, long_sum, tens, data4bounds){

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
            var results = [];
            var result =  yield rq.search(url,data4bounds);
            results = results.concat(result.results)

            var sum =  result.total;
            var pagesum =  Math.ceil(sum/20);
            for(var k = 1; k<=pagesum; k++){
                data4bounds.page_num = k;
                var result2 =  yield rq.search(url,data4bounds);
                results = results.concat(result2.results)
            }
            var bbox = data4bounds.bounds;
            var markers = '';
            var labels = '';
            var labelStyles = '';
            console.log(bbox)
            if(results.length === 0){
                continue;
            }
            if(results.length <= 40){//如果50个点以内，则直接一张图
                results.map((point)=>{
                    if(point && point.name.indexOf('吴裕泰') ===-1 && point.name.indexOf('张一元') ===-1 && point.name.indexOf('茶楼') ===-1){
                        labels += point.location.lng || '';
                        labels += ','
                        labels += point.location.lat || '';
                        labels += '|';
                        // labelStyles += point.name || '空';
                        // labelStyles += '-';
                        // labelStyles += point.address ? (point.address.length > 16 ? point.address.substr(0,16) : point.address) : '空';
                        // labelStyles += '-';
                        labelStyles += point.telephone || '空';
                        labelStyles += ','
                        labelStyles += '1,14,0x990099,0xff00,1|'
                        // labelStyles += '1,14,0xffff00,0xff0000,0|'
                    }
                })
                if(labels.length !== 0){
                    var generagteImg = 'http://api.map.baidu.com/staticimage/v2?ak=oiEutVru1rnLPMj2USktYVFLM6BPijf3&width=1000&height=800&bbox='
                    generagteImg += bbox + '&labels=' + labels + '&labelStyles=' + labelStyles ;
                    var filepath = yield lib.saveImg(generagteImg, i + '-' +l + '-'+ '0' + '--' + Math.random().toString(36).slice(2,5));
                }

            }else{//否则则生成几张图
                var step = 40;
                var step_num = Math.ceil(results.length/step);
                var yu = results.length%step;
                for(var h = 0; h< step_num ; h++){
                    var xx = step;
                    if(h === (step_num-1)){
                        xx = yu;
                    }
                    var markers = '';
                    var labels = '';
                    var labelStyles = '';
                    for(var t = 0; t< xx ;t++){
                        var cell = results[h * 50 + t];
                        if(cell && cell.name.indexOf('吴裕泰') ===-1 && cell.name.indexOf('张一元') ===-1 && cell.name.indexOf('茶楼') ===-1){
                            labels += cell.location.lng || '';
                            labels += ','
                            labels += cell.location.lat || '';
                            labels += '|';
                            // labelStyles += cell.name || '空';
                            // labelStyles += '-';
                            // labelStyles += cell.address ? (cell.address.length > 16 ? cell.address.substr(0,16) : cell.address) : '空';
                            // labelStyles += '-';
                            labelStyles += cell.telephone || '空';
                            labelStyles += ','
                            labelStyles += '1,14,0x990099,0xff00,1|'
                            // labelStyles += '1,14,0xffff00,0xff0000,0|'
                        }
                    }
                    if(labels.length !== 0){
                        var generagteImg = 'http://api.map.baidu.com/staticimage/v2?ak=oiEutVru1rnLPMj2USktYVFLM6BPijf3&width=1000&height=800&bbox='
                        generagteImg += bbox + '&labels=' + labels + '&labelStyles=' + labelStyles ;
                        var filepath = yield lib.saveImg(generagteImg, i + '-' +l + '-' + h + '--'+Math.random().toString(36).slice(2,5));
                    }

                }

            }

        }

    }

    // var url = 'http://api.map.baidu.com/staticimage/v2?ak=oiEutVru1rnLPMj2USktYVFLM6BPijf3&center=116.403874,39.914889&width=500&height=500&zoom=11&labels=%E6%B5%B7%E6%B7%80|116.487812,40.017524|%E6%9C%9D%E9%98%B3|%E5%A4%A7%E7%BA%A2%E9%97%A8|116.442968,39.797022|%E4%B8%B0%E5%8F%B0|116.275093,39.935251|116.28377,39.903743&labelStyles=%E6%B5%B7%E6%B7%80,1,32,0x990099,0xff00,1|%E4%B8%9C%E5%8C%97%E4%BA%94%E7%8E%AF,1,14,0xffffff,0x996600,1|%E6%9C%9D%E9%98%B3,1,14,,0xff6633,1|%E5%A4%A7%E7%BA%A2%E9%97%A8,1,32,0,0xffffff,1|%E6%9C%AA%E7%9F%A5%EF%BC%9F%EF%BC%81%23%EF%BF%A5%25%E2%80%A6%E2%80%A6%26*%EF%BC%88%EF%BC%89%EF%BC%81,1,14,0xff0000,0xffffff,1|%E4%B8%B0%E5%8F%B0%E5%A4%A7%E8%90%A5,1,24,0,0xcccccc,1|%E8%A5%BF%E5%9B%9B%E7%8E%AF,,14,0,0xffffff,|%E6%88%91%E4%BB%AC%E4%BC%9F%E5%A4%A7%E7%A5%96%E5%9B%BD%E9%A6%96%E9%83%BD%E5%8C%97%E4%BA%AC,1,25,0xffff00,0xff0000,0'
    // var filepath = yield lib.saveImg(url, 'ddddd');

    // var filepath = yield lib.save(results);
    // return filepath
}
// module.exports = router;
// http://api.map.baidu.com/staticimage/v2?ak=oiEutVru1rnLPMj2USktYVFLM6BPijf3&width=1000&height=800&bbox=39.821708,116.173727,39.768895,116.107037&markers=116.170725,39.817613|116.161884,39.811944|116.156643,39.811656|116.156643,39.811656
// ak=E4805d16520de693a3fe707cdc962045
// &center=116.403874,39.914889
// &width=500&height=500&zoom=11
// &labels=%E6%B5%B7%E6%B7%80|116.487812,40.017524|%E6%9C%9D%E9%98%B3|%E5%A4%A7%E7%BA%A2%E9%97%A8|116.442968,39.797022|%E4%B8%B0%E5%8F%B0|116.275093,39.935251|116.28377,39.903743
// &labelStyles=%E6%B5%B7%E6%B7%80,1,32,0x990099,0xff00,1|%E4%B8%9C%E5%8C%97%E4%BA%94%E7%8E%AF,1,14,0xffffff,0x996600,1|%E6%9C%9D%E9%98%B3,1,14,,0xff6633,1|%E5%A4%A7%E7%BA%A2%E9%97%A8,1,32,0,0xffffff,1|%E6%9C%AA%E7%9F%A5%EF%BC%9F%EF%BC%81%23%EF%BF%A5%25%E2%80%A6%E2%80%A6%26*%EF%BC%88%EF%BC%89%EF%BC%81,1,14,0xff0000,0xffffff,1|%E4%B8%B0%E5%8F%B0%E5%A4%A7%E8%90%A5,1,24,0,0xcccccc,1|%E8%A5%BF%E5%9B%9B%E7%8E%AF,,14,0,0xffffff,|%E6%88%91%E4%BB%AC%E4%BC%9F%E5%A4%A7%E7%A5%96%E5%9B%BD%E9%A6%96%E9%83%BD%E5%8C%97%E4%BA%AC,1,25,0xffff00,0xff0000,0


(function dd() {
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
    co(function* () {
        var filepath = yield excute(
            latitude_start,
            longitude_start,
            latitude_step,
            longitude_step,
            12,
            12,
            100000000,
            data4bounds)
        return filepath;
    }).then(function (value) {
        console.log(value);
    }, function (err) {
        console.error(err.stack);
    });

})();