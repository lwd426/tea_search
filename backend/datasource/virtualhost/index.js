/**
 * 状态：与slb接口沟通脚本
 * 用途： 数据服务脚本
 * 应提供功能： 与slb服务沟通
 * 开发者：刘伟东
 * Created by lwd426 on 17/4/13.
 */

var request = require('request');
var Promise = require("promise");
var parseJson = require('json-superparser');
var querystring = require('query-string');
var HEADERS = require('../../../config').VH.headers;
var URL = require('../../../config').VH.url;


module.exports = {
    /**
     * 保存数据
     * @returns {*}
     */
    post:  function* (url, data) {
        var args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
            var result = {};
            var opt = {
                method: 'POST',
                headers: HEADERS,
                uri: URL + url,
                body: JSON.stringify(data)
            }
            request(opt, function (error, response, body) {
                if(body.error) {
                    result.error = body.error;
                    console.log(body.error)
                }
                result.resp = body;
                resolve(result);
            })

        });
    },
    /**
     * 给数据服务触发get请求
     * @param params where条件的请求参数们组成的对象
     * @param opts 作为where的平行条件的查条件们组成的对象
     * @returns {*|exports|module.exports}
     * @ 注意: 一次查询最多只能查出100条
     */
    get:  function* (url) {
        var args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
            var result = {};
            var opt = {
                method: 'GET',
                uri:  URL +  url,
                headers: HEADERS
            }
            // console.log(URL + '/v2/virtualhost/getbyname/' + args[0])
            request(opt, function (error, response, body) {
                var body = parseJson(body);
                if(!body || body.error) {
                    console.log('Error now! Request Error'+body.error+ ', Please do with it...')
                }
                result = body;
                resolve(result);
            })

        });

    },
    update:  function* (url, params) {
        var args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
            var result = {};
            var opt = {
                method: 'PUT',
                uri: url,
                headers: HEADERS,
                body: JSON.stringify(params)
            }
            console.log(URL + '/v2/virtualhost/getbyname/' + args[0])
            request(opt, function (error, response, body) {
                var body = parseJson(body);
                if(!body || body.error) {
                    console.log('Error now! Request Error'+body.error+ ', Please do with it...')
                    resolve({
                        status: 'failure',
                        info: body.error
                    })
                }
                result = body;
                resolve({
                    status: 'success',
                    info: result
                })
            })

        });

    },
    /**
     * 删除数据
     * @param params
     * @returns {*}
     */
    // update:  function* (params) {
    //     var args = Array.prototype.slice.call(arguments);
    //     return new Promise(function (resolve, reject) {
    //         var result = {};
    //         var opt = {
    //             method: 'DELETE',
    //             uri: DBC.url + '/'+ args[0],
    //             headers: DBC.get
    //         }
    //         console.log(DBC.url + '?' + querystring.stringify(args[1]) + '&where=' + JSON.stringify(args[0]))
    //         request(opt, function (error, response, body) {
    //             var body = parseJson(body);
    //             if(!body || body.error) {
    //                 console.log('Error now! Request Error, Please do with it...')
    //             }
    //             result = body;
    //             resolve(result);
    //         })
    //
    //     });
    //
    // }
}
