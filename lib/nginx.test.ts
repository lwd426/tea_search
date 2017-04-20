import nginx = require("./nginx");
nginx([

        {
            urlArray: ['/yyyy/'],
            serverArray: ["117.121.54.110", "2.2.2.8"],
            uidArray:['34'],
            default: false
        },
        {
            urlArray: ['/yyyy/.*'],
            serverArray: ["1.1.1.1"],
           uidArray: ['123'],
            default: false
        },

        {
            urlArray: ["/yyyy/a.html"],
            serverArray: ['7.8.99.6'],//传给我所有的没使用灰度服务器
            uidArray:[],
            // uidArray:['3456875456'],
            // serverArray: [],//传给我所有的没使用灰度服务器
            default: false
        },
        {
            urlArray: ["/"],
            serverArray: ['3.3.3.3', '4.4.4.4', '5.5.5.5', '6.6.6.6'],//传给我所有的没使用灰度服务器
            // serverArray: [],//传给我所有的没使用灰度服务器
            default: true
        }
    ]
);
