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
           uidArray: ['123'],
           regionArray: ['beijing'],
            default: false
        },

        {
            urlArray: ["/"],
            serverArray: ['2'],//传给我所有的没使用灰度服务器
            uidArray:["zhuoyongran",'zyr'],
            // uidArray:['3456875456'],
            // serverArray: [],//传给我所有的没使用灰度服务器
            default: false
        },{
            urlArray: ["/"],
            serverArray: ['2.8'],//传给我所有的没使用灰度服务器
            uidArray:["zhuoyongran1"],
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
