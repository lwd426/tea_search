<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <style type="text/css">
        body, html,#allmap {width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
        #l-map{height:100%;width:78%;float:left;border-right:2px solid #bcbcbc;}
        #r-result{height:100%;width:20%;float:left;}
    </style>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=您的密钥"></script>
    <title>添加多个标注点</title>
</head>
<body><!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <style type="text/css">
        body, html {width: 100%;height: 100%;margin:0;font-family:"微软雅黑";}
        #allmap{width:100%;height:500px;}
        p{margin-left:5px; font-size:14px;}
    </style>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=oiEutVru1rnLPMj2USktYVFLM6BPijf3"></script>
    <script type="text/javascript" src="http://api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js"></script>
    <title>设置地图显示范围</title>
</head>
<body>
<div id="allmap"></div>
<p>将地图显示范围设定在指定区域，地图拖出该区域后会重新弹回。</p>
</body>
</html>
<script type="text/javascript">
    // 百度地图API功能
    var pointss = [ '39.7174,116.789481', '39.716163,116.79461' ]


    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
    var b = new BMap.Bounds(new BMap.Point(116.773940,39.716082 ),new BMap.Point(116.840630,39.768895));
    BMapLib.AreaRestriction.setBounds(map, b);
    // 编写自定义函数,创建标注
    function addMarker(point){
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
}

    // 随机向地图添加25个标注

    for (var i = 0; i < pointss.length; i ++) {
    var pot = pointss[i].split(',');
    var pointdd = new BMap.Point(pot[1], pot[0]);
    addMarker(pointdd);
}
</script>
<div id="allmap"></div>
</body>
</html>
<script type="text/javascript">
    // 百度地图API功能
    var pointss = [ '39.817613,116.170725',
    '39.811944,116.161884',
    '39.811656,116.156643',
    '39.811656,116.156643' ]

    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
    var b = new BMap.Bounds(new BMap.Point(116.173727,39.821708),new BMap.Point(116.107037,39.768895 ));
    BMapLib.AreaRestriction.setBounds(map, b);
    // 编写自定义函数,创建标注
    function addMarker(point){
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
}
    // 随机向地图添加25个标注

    for (var i = 0; i < pointss.length; i ++) {
    var pot = pointss[i].split(',');
    var point = new BMap.Point(pot[1], pot[0]);
    addMarker(point);
}
</script>



数据结构
{
    '经度纬度': {
        points: ['lng,lat',...],//店铺坐标数组
        code: 1,
        name: xxx,
        address: xxx,
        phone: xxx
}