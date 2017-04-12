"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nginx = require("./nginx");
nginx([
    {
        urlArray: ['/bdf/'],
        regionArray: ['henan', 'sichuan'],
        serverArray: ["1.1.1.1", "2.2.2.8"],
        uidArray: [],
        default: false
    }, {
        urlArray: ['/a.t'],
        regionArray: ['henan', 'sichuan', 'shandong'],
        serverArray: ["1.1.1.1", "2.2.2.8"],
        uidArray: [],
        default: false
    },
    {
        urlArray: ['~ /abcD'],
        uidArray: ['zhuoyongran123', 'zyr123'],
        serverArray: ['0.0.0.0'],
        default: false
    },
    {
        // urlArray: ['/zyr/','/zyr1'],
        urlArray: ['/abcd'],
        uidArray: ['zhuoyongran'],
        regionArray: ['linyi'],
        serverArray: ['0.0.0.0'],
        default: false
    },
    {
        urlArray: ['/'],
        serverArray: ['3.3.3.3', '4.4.4.4', '5.5.5.5', '6.6.6.6'],
        default: true
    }
]);
