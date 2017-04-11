"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nginx = require("./nginx");
nginx([
    {
        urlArray: '/',
        regionArray: ['bj', 'shanghai'],
        serverArray: ["1.1.1.1", "2.2.2.8"],
        uidArray: [],
        default: false
    },
    {
        urlArray: ['/b.html', '/c.html'],
        uidArray: ['zhao', 'qian'],
        serverArray: ["1.1.1.2", "2.2.2.2"],
        default: false
    },
    {
        urlArray: ['/'],
        serverArray: ['3.3.3.3', '4.4.4.4', '5.5.5.5', '6.6.6.6'],
        default: 1
    }
]);
