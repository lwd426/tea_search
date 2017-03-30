/**
 * 用途： 数据服务脚本
 * 应提供功能： 与数据服务沟通，完成增删改查
 * 开发者：刘伟东
 * Created by lwd426 on 17/3/30.
 */

var request = require('request');
var Promise = require("promise");
var parseJson = require('json-superparser');
var querystring = require('query-string');
var DBC = require('../../config').DB;


module.exports = {
    /**
	 * 保存数据
     * @returns {*}
     */
	save:  function* () {
		var args = Array.prototype.slice.call(arguments);
		return new Promise(function (resolve, reject) {
			var result = {};
			var opt = {
				method: 'POST',
				uri: DBC.url,
				headers: DBC.post,
				timeout: DBC.timeout * 1000 || 5000,
				body: JSON.stringify(args[0])
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
	search:  function* (params, opts) {
		var args = Array.prototype.slice.call(arguments);
		return new Promise(function (resolve, reject) {
			var result = {};
			var opt = {
				method: 'GET',
				uri: DBC.url + '?' + querystring.stringify(args[1]) + '&where=' + JSON.stringify(args[0]),
				headers: DBC.get
			}
			console.log(DBC.url + '?' + querystring.stringify(args[1]) + '&where=' + JSON.stringify(args[0]))
			request(opt, function (error, response, body) {
				var body = parseJson(body);
				if(!body || body.error) {
					console.log('Error now! Request Error, Please do with it...')
				}
				result = body;
				resolve(result);
			})

		});

	},
    /**
	 * 删除数据
     * @param params
     * @returns {*}
     */
    delete:  function* (params) {
        var args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
            var result = {};
            var opt = {
                method: 'DELETE',
                uri: DBC.url + '/'+ args[0],
                headers: DBC.get
            }
            console.log(DBC.url + '?' + querystring.stringify(args[1]) + '&where=' + JSON.stringify(args[0]))
            request(opt, function (error, response, body) {
                var body = parseJson(body);
                if(!body || body.error) {
                    console.log('Error now! Request Error, Please do with it...')
                }
                result = body;
                resolve(result);
            })

        });

    }
}
