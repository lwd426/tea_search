"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nginx = require("./nginx");
nginx([
    {
        urlArray: ['/vplay_.*.html'],
        serverArray: ["1.1.1.1", "2.2.2.8"],
        default: false
    },
    {
        urlArray: ['/'],
        serverArray: ["1.1.1.1"],
        uidArray: ['123'],
        default: false
    },
    {
        urlArray: ['/'],
        serverArray: ['3.3.3.3', '4.4.4.4', '5.5.5.5', '6.6.6.6'],
        default: true
    }
]);
