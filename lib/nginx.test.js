"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nginx = require("./nginx");
nginx([
    {
        url: '/',
        regionArray: ['bj', 'shanghai'],
        serverArray: ["1.1.1.1", "2.2.2.8"],
        uidArray: [],
        default: false
    },
    {
        url: ['/b.html', '/c.html'],
        uidArray: ['bj', 'shanghai'],
        serverArray: ["1.1.1.2", "2.2.2.2"],
        default: false
    },
    {
        url: ['/'],
        serverArray: ['3.3.3.3', '4.4.4.4', '5.5.5.5', '6.6.6.6'],
        default: 1
    }
]);
