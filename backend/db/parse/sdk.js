const Parse = require('parse/node');
const DB = require('../../../config').DB.url;


Parse.initialize('gatedLaunch', '', 'rqGADqjw2BfGjnxe38gd29LHneNSCmP3');
Parse.serverURL = DB;

module.exports = {
    initObject: function(objname){
        var Object = Parse.Object.extend(objname);
        return new Object();
    },
    initQuery: function(objname){
        var Object = Parse.Object.extend(objname);
        return new Parse.Query(Object);
    },
    save: function *(obj, data){
        return new Promise(function(resolve, reject){
            obj.save(data, {
                success: function(obj) {
                    // The object was saved successfully.
                    resolve({status: true, data: obj})
                },
                error: function(obj, error) {
                    // The save failed.
                    // error is a Parse.Error with an error code and message.
                    resolve({status: false, data: error})
                }
            });
        })
    },
    get: function* (query){
        return new Promise(function(resolve, reject){
            //docs: http://parseplatform.org/docs/js/guide/#queries
            // query.equalTo("type", "Dan Stemkoski");
            // query.notEqualTo("playerName", "Michael Yabuti");
            // query.greaterThan("playerAge", 18);
            // query.limit(10);
            // query.skip(10);
            // query.ascending("score");
            // query.descending("score");
            // query.lessThan("wins", 50);
            // query.lessThanOrEqualTo("wins", 50);
            // query.greaterThan("wins", 50);
            // query.greaterThanOrEqualTo("wins", 50);
            // query.containedIn("playerName",["Jonathan Walsh", "Dario Wunsch", "Shawn Simon"]);
            query.find({
                success: function (results) {
                    console.log(results)
                    resolve(results)
                },
                error: function (error) {
                    resolve([])
                    console.error("Error: " + error.code + " " + error.message);
                }
            });
        })
    },
    delete: function *(obj){
        return new Promise(function(resolve, reject){
            obj.destroy({
                success: function(obj) {
                    resolve({status: true, data: obj})
                },
                error: function(obj, error) {
                    resolve({status: false, data: error})
                }
            });
        })
    }
}






