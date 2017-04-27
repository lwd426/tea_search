import 'whatwg-fetch';


async function postData (chart_url, data) {
    try{
        let response = await fetch(chart_url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let res = await response.json();
        return res;
    }catch(e){
        console.log('error', e);
    }
}



//首页 testgroupt 重新按照最近修改时间排序，slb信息加入到 testgroupt 里
function sortTime (a,b){
    let a_since = a.time == '-' ? 0 : new Date(a.time.replace(/-/g, "/")).getTime();
    let b_since = b.time == '-' ? 0 : new Date(b.time.replace(/-/g, "/")).getTime();
    return (b_since - a_since)
}
export function setMainPageData(res){
    let testGroupsArr = [];
    res.map((lib,index) => {
        if(lib.testGroups.length > 0){
            lib.testGroups.map((project,idx,) => {
                if(project['first_publish_time'] && project['strageties'].length > 0){ //过滤掉没发布的项目、策略为0的项目
                    project['slb_name'] = lib.name;
                    project['slb_objectId'] = lib.objectId;
                    project['slb_servers'] = lib.servers;
                    testGroupsArr.push(project);
                }
                
            })
        }
    })
    return testGroupsArr.sort(sortTime);
}


export function setMainPageOptions(testGroups, arr, type) {
    let index = 0;
    testGroups.forEach(function(project){
        let inObj ={};

        let strageties = [] //各个策略的tag 数组
        let stra_running = [];//running状态的策略 状态
        if(project.strageties.length > 0){
            project.strageties.forEach(function(stragety){
                if(stragety.tag){
                    strageties.push(stragety.tag)
                }
                if(stragety.is_abolished == false && stragety.stra_status == 'running'){
                    stra_running.push(stragety.stra_status)
                }
            })
        }

        

        if(type == 'running'){
            if(project.time != '-' && stra_running.length > 0){//running 策略的数量大于0，此项目的status就是 running
                index ++;
                if(index == 1){
                    inObj['value'] = 'running';
                    inObj['label'] = '运行中'
                    inObj['disabled'] = true;
                    arr.push(inObj)
                    inObj = {}
                }
                inObj['value'] = project.objectId;
                inObj['label'] = project.name;
                inObj['strageties'] = strageties;
                arr.push(inObj)
            }
        }
        if(type == 'new'){
            if(project.time == '-' || project.strageties.length == 0){//发布时间为 -  即为 new
                index ++;
                if(index == 1){
                    inObj['value'] = 'new';
                    inObj['label'] = '新生成'
                    inObj['disabled'] = true;
                    arr.push(inObj)
                    inObj = {}
                }
                inObj['value'] = project.objectId;
                inObj['label'] = project.name;
                inObj['disabled'] = true;
                arr.push(inObj)
            }
        }
        if(type == 'stopped'){
            if(project.time != '-' && stra_running.length == 0 && project.strageties.length > 0){
                index ++;
                if(index == 1){
                    inObj['value'] = 'stopped';
                    inObj['label'] = '已停止'
                    inObj['disabled'] = true;
                    arr.push(inObj)
                    inObj = {}
                }
                inObj['value'] = project.objectId;
                inObj['label'] = project.name;
                inObj['strageties'] = strageties;
                arr.push(inObj)
            }
        }
    })
    return arr
}

/*

 }



 if(slblist.length > 0 ){
    slblist.forEach(function(slb,index){
        let obj = {}
        obj['value'] = slb.objectId;
        obj['label'] = slb.name;

        if(slb.testGroups.length > 0){
            let arr = [];
            arr = setMainPageOptions(slb.testGroups, arr, 'running');
            arr = setMainPageOptions(slb.testGroups, arr, 'new');
            arr = setMainPageOptions(slb.testGroups, arr, 'stopped');
            slb.testGroups.forEach(function(project,index){
                let inObj ={};

                let strageties = [] //各个策略的tag 数组
                if(project.strageties.length > 0){
                    project.strageties.forEach(function(stragety,index){
                        if(stragety.tag){
                            strageties.push(stragety.tag)
                        }
                    })
                }

                if(project.status == 'running'){
                    inObj['value'] = project.objectId;
                    inObj['label'] = project.name;
                    inObj['strageties'] = strageties;

                }else if(project.status == 'new'){
                    inObj['value'] = project.objectId;
                    inObj['label'] = project.name + '（new）';
                    inObj['disabled'] = true;
                }else if(project.status == 'stopped'){
                    inObj['value'] = project.objectId;
                    inObj['label'] = project.name + '(stopped)';
                    inObj['strageties'] = strageties;
                }
                arr.push(inObj)
            })
            obj['children'] = arr;
            options.push(obj);
        }

        *****************************************************************************

        if(slb.testGroups.length > 0){
            let arr = [];
            slb.testGroups.forEach(function(project,index){
                let inObj ={};
                if(project.strageties.length > 0){
                    let strageties = [] //各个策略的tag 数组
                    project.strageties.forEach(function(stragety,index){
                        if(stragety.tag){
                            strageties.push(stragety.tag)
                        }
                    })
                    if(strageties.length > 0){
                        inObj['value'] = project.objectId;
                        inObj['label'] = project.name;
                        inObj['strageties'] = strageties;
                    }else{
                        inObj['value'] = project.objectId;
                        inObj['label'] = project.name + '（所有策略未发布）';
                        inObj['disabled'] = true;
                    }
                    
                    arr.push(inObj)
                }else{
                    inObj['value'] = project.objectId;
                    inObj['label'] = project.name + '（项目下无策略）'
                    inObj['disabled'] = true;
                    arr.push(inObj)
                }
                
            })
            obj['children'] = arr;
            options[option_idx] = obj;
            option_idx ++;
        }else{
            obj['label'] = slb.name + '（此测试组下无项目）'
            obj['disabled'] = true;
        }
    })
}

*/

//判断浏览器类型
 function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) { return "Opera" }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) { return "FF"; } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){ return "Chrome"; }
    if (userAgent.indexOf("Safari") > -1) { return "Safari"; } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { return "IE"; }; //判断是否IE浏览器
    if (userAgent.indexOf("Trident") > -1) { return "Edge"; } //判断是否Edge浏览器
}
function SaveAs5(imgURL) {
    var oPop = window.open(imgURL,"","width=1, height=1, top=5000, left=5000");
    for(; oPop.document.readyState != "complete"; ) {
        if (oPop.document.readyState == "complete")break;
    }
    oPop.document.execCommand("SaveAs");
    oPop.close();
}

export function generateExcel(error, src) {
    myBrowser();
    var basepath = ''
    if (myBrowser()==="IE"||myBrowser()==="Edge"){ //IE
        odownLoad.href="#";
        var oImg=document.createElement("img");
        oImg.src=basepath + src;
        oImg.id="downImg";
        var odown=document.getElementById("down");
        odown.appendChild(oImg);
        SaveAs5(document.getElementById('downImg').src)
    }else{ //!IE
        var elemIF = document.createElement("iframe");
        elemIF.src = basepath + src;
        elemIF.style.display = "none";
        elemIF.href=basepath +  src;
        elemIF.download="";
        document.body.appendChild(elemIF);

    }
}


export  function postTableData (chart_url, data, callback){
    fetch(chart_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((res) => {
        return res.json()
    }).then((json) => {
        if (callback) callback(null, json.data);
    }).catch((e) => {
        if (callback) callback(e.message);
    })
}