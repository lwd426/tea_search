"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var if_1 = require("./if");
var check_1 = require("./check");
var uidname = 'ssouid';
var four = (function () {
    function four(meta, allServers) {
        this.type = 'url_region_uid';
        this.index = 0;
        this.allServers = allServers;
        this.meta = meta;
    }
    four.prototype.doit = function () {
        var location = this.location();
        var upstreams = this.getUpstreams();
        var group = '';
        return {
            location: location, upstreams: upstreams, group: group
        };
    };
    four.prototype.location = function () {
        var arr = [this.meta.url];
        var s = "";
        var n = this.getUpstreamName();
        var X_Location = "";
        for (var _i = 0, _a = this.meta.servers; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v.regions) {
                X_Location = if_1.country_name_country_code_city_code;
            }
        }
        for (var _b = 0, arr_1 = arr; _b < arr_1.length; _b++) {
            var v = arr_1[_b];
            var u = this.uidsregionsHandler();
            s += "\n            location " + v + " {\n                " + X_Location + "\n                " + u + "\n                proxy_pass http://" + n + "_default;\n            }  \n            ";
        }
        return s;
    };
    four.prototype.uidsregionsHandler = function () {
        var r = "";
        for (var _i = 0, _a = this.meta.servers; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v.uids) {
                var n = this.getOneUpstreamName(v);
                r += "\n                if ($COOKIE_" + uidname + " ~* \"" + v.uids.join("|") + "\"){\n                    proxy_pass http://" + n + ";\n                }";
            }
            if (v.regions) {
                var n = this.getOneUpstreamName(v);
                r += "\n                if ($geoip2_data_" + if_1.level + "_name ~* \"" + v.regions.join("|") + "\"){\n                    proxy_pass http://" + n + ";\n                }";
            }
        }
        return r;
    };
    four.prototype.getOneUpstreamName = function (v) {
        if (v.uids) {
            return this.type + "_" + v.uids[0] + "_" + v.servers[0].replace(/\./g, '_').replace(/\:/g, '_');
        }
        if (v.regions) {
            return this.type + "_" + v.regions[0].replace(/\s/g, "") + "_" + v.servers[0].replace(/\./g, '_').replace(/\:/g, '_');
        }
    };
    four.prototype.getUpstreamName = function () {
        if (!this.upstreamName) {
            var rand = (Math.random() + "").slice(-5);
            this.upstreamName = this.type + "_" + rand + "_";
        }
        return this.upstreamName;
    };
    four.prototype.getUpstreams = function () {
        var s = "";
        for (var _i = 0, _a = this.meta.servers; _i < _a.length; _i++) {
            var v = _a[_i];
            var rr = '';
            var n = this.getOneUpstreamName(v);
            var ss = "";
            for (var _b = 0, _c = v.servers; _b < _c.length; _b++) {
                var ip = _c[_b];
                ss += "\n                  server " + ip + ";\n                ";
            }
            rr += "\n                upstream " + n + " { \n                     ip_hash;\n                      " + ss + "\n                }\n                ";
            s += rr;
        }
        return s + this.getDefault();
    };
    four.prototype.getDefault = function () {
        var n = this.getUpstreamName();
        var s = '';
        var arrd = [];
        for (var _i = 0, _a = this.meta.servers; _i < _a.length; _i++) {
            var v = _a[_i];
            v.servers.forEach(function (ip) {
                if (arrd.indexOf(ip) == -1) {
                    arrd.push(ip);
                }
            });
        }
        var cha = check_1.Methods.differenceSet(this.allServers, arrd);
        cha.forEach(function (ip) {
            s += "\n                    server " + ip + ";\n               ";
        });
        return "\n                upstream " + n + "_default { \n                     ip_hash;\n                      " + s + "\n                }\n                ";
    };
    return four;
}());
exports.four = four;
//# sourceMappingURL=four.js.map