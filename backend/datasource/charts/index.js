var request = require('request');
 var Promise = require("promise");
 var parseJson = require('json-superparser');
 //var querystring = require('query-string');
 var HEADERS = require('../../../config').CHARTS.headers;
 var URL = require('../../../config').CHARTS.url;


 module.exports = {
     post:  function* (url, data) {
         //var args = Array.prototype.slice.call(arguments);
         return new Promise(function (resolve, reject) {
             var result = {};
             var opt = {
                 method: 'POST',
                 headers: HEADERS,
                 uri: URL + url,
                 body: JSON.stringify(data)
             }
             request(opt, function (error, response, body) {
                 var body = parseJson(body);
                 if(body.error) {
                     result.error = body.error;
                     console.log(body.error)
                 }
                 result = body;
                 resolve(result);
             })

         });
     },

     // get:  function* (url) {
     //     var args = Array.prototype.slice.call(arguments);
     //     return new Promise(function (resolve, reject) {
     //         var result = {};
     //         var opt = {
     //             method: 'GET',
     //             uri:  URL +  url,
     //             headers: HEADERS
     //         }
     //         // console.log(URL + '/v2/virtualhost/getbyname/' + args[0])
     //         request(opt, function (error, response, body) {
     //             var body = parseJson(body);
     //             if(!body || body.error) {
     //                 console.log('Error now! Request Error'+body.error+ ', Please do with it...')
     //             }
     //             result = body;
     //             resolve(result);
     //         })

     //     });
     // },
 }
