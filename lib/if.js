"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.level = 'city';
exports.country_name_country_code_city_code = "add_header X-Location $geoip2_data_country_name-$geoip2_data_country_code-$geoip2_data_city_name;";
exports.geo1p2DB = "\n            geoip2 /etc/GeoLite2-Country.mmdb {\n                $geoip2_data_country_code default=CN source=$remote_addr country iso_code;\n                $geoip2_data_country_name default=China country names en;\n            }\n            geoip2 /etc/GeoLite2-City.mmdb {\n                $geoip2_data_city_name default=Beijing names en;\n            }\n           ";
