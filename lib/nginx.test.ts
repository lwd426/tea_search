import nginx = require("./nginx");
nginx([

       /* {
            urlArray: ['/yyyy/uid'],
            // serverArray: ["117.121.54.110"],
            serverArray: [],
            regionArray:['bj'],
            // uidArray:['34','999'],
            default: false
        },*/
        {
            urlArray: ['/yyyy/uid'],
            serverArray: ["1"],
           // uidArray: ['123'],
           regionArray: ['123'],
            default: false
        },

        {
            urlArray: ["/yyyy/a.html"],
            serverArray: ['2'],//传给我所有的没使用灰度服务器
            uidArray:[],
            // uidArray:['3456875456'],
            // serverArray: [],//传给我所有的没使用灰度服务器
            default: false
        },
        {
            urlArray: ["/"],
            serverArray: ['3','4'],//传给我所有的没使用灰度服务器
            // serverArray: [],//传给我所有的没使用灰度服务器
            default: true
        }
    ]
);
