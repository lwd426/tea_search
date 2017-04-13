"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var if_1 = require("./if");
var check_1 = require("./check");
var three = (function () {
    function three(meta, allServers) {
        this.type = 'url_region_uid';
        this.index = 0;
        this.allServers = allServers;
        this.meta = meta;
    }
    three.prototype.doit = function () {
        var location = this.location();
        var upstreams = this.getUpstream();
        var group = '';
        return {
            location: location, upstreams: upstreams, group: group
        };
    };
    three.prototype.location = function () {
        var arr = [this.meta.url];
        var s = "";
        var n = this.getUpstreamName();
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var v = arr_1[_i];
            var u = this.uidArrayHandler();
            var r = this.regionArrayHandler();
            s += "\n            location " + v + " {\n                " + u + "\n                " + r + "\n                #default\n                proxy_pass http://$" + n + "_default;\n            }  \n            ";
        }
        return s;
    };
    three.prototype.uidArrayHandler = function () {
        var s = "";
        if (Array.isArray(this.meta.uidArray) && !this.meta.uidArray.length) {
            return '';
        }
        var n = this.getUpstreamName();
        var uids = this.meta.uidArray.join("|");
        s += "\n        if($COOKIE_uid ~* \"" + uids + "\"){\n            proxy_pass http://$" + n + ";\n        }\n        ";
        return s;
    };
    three.prototype.regionArrayHandler = function () {
        var s = "";
        var n = this.getUpstreamName();
        var uids = this.meta.regionArray.join("|");
        var geoLevel = if_1.level;
        s += "\n        if($geoip2_data_" + geoLevel + "_name ~* \"" + uids + "\"){\n            proxy_pass http://$" + n + ";\n        }\n        ";
        return s;
    };
    three.prototype.getUpstreamName = function () {
        if (!this.upstreamName) {
            var rand = (Math.random() + "").slice(-5);
            this.upstreamName = this.type + "_" + rand + "_" + this.meta.serverArray[this.index];
        }
        return this.upstreamName;
    };
    three.prototype.getUpstream = function () {
        var n = this.getUpstreamName();
        var s = '';
        this.meta.serverArray.forEach(function (ip) {
            s += "\n                    server " + ip + ";\n               ";
        });
        return "\n                upstream " + n + " { \n                     ip_hash;\n                      " + s + "\n                }\n                " + this.getDefault();
    };
    three.prototype.getDefault = function () {
        var n = this.getUpstreamName();
        var s = '';
        var cha = check_1.Methods.differenceSet(this.allServers, this.meta.serverArray);
        cha.forEach(function (ip) {
            s += "\n                    server " + ip + ";\n               ";
        });
        return "\n                upstream " + n + "_default { \n                     ip_hash;\n                      " + s + "\n                }\n                ";
    };
    return three;
}());
exports.three = three;
