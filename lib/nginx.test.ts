import nginx = require("./nginx");
nginx([

    {
            // urlArray: ['/zyr/','/zyr1'],
            urlArray: ['= /vplay1234.html'],
            // uidArray: ['zhuoyongran'],
            regionArray: ['linyi'],
            serverArray: ['0.0.0.0'],
            default: false
        },{
            // urlArray: ['/zyr/','/zyr1'],
            urlArray: ['= /vplay1234.html'],
            uidArray: ['zhuoyongran'],
            // regionArray: ['linyi'],
            serverArray: ['0.0.0.2'],
            default: false
        },

        {
            urlArray: ['/'],
            serverArray: ['3.3.3.3', '4.4.4.4', '5.5.5.5', '6.6.6.6'],//传给我所有的没使用灰度服务器
            default: true
        }
    ]
);
