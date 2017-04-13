"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.level = 'subdivisions';
var defaultUpstream = "defaultUpstream";
var geoip_city = "/etc/maxmind-city.mmdb";
var geoip_subdivisions = "/etc/maxmind-subdivisions.mmdb";
exports.conf = {
    level: exports.level, defaultUpstream: defaultUpstream, geoip_city: geoip_city, geoip_subdivisions: geoip_subdivisions
};
