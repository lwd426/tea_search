import * as TYPES from './constants';
import fetch from '../../fetch'
const HOST = require('../../../config').HOST;

const testgroup_url = HOST + '/testgroup'
const stragety_url = HOST + '/stragety'
const city_url = HOST + '/city'
const server_url = HOST + '/webserver'
const tag_url = HOST + '/stragety/tag'
const slb_publish_url = HOST + '/slb/publish'

/**
 * 进入编辑策略页面
 * @returns {{type}}
 */
export function edit_stragetylist(tgid, slbid) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(stragety_url + '?tgid='+tgid,function(err, result){
            if(err)  dispatch(getStragetyListSuccess([], tgid, slbid))
            dispatch(getStragetyListSuccess(result.data, tgid, slbid))
        }))
    }
}

export function getStragetyListSuccess(list, tgid, slbid){
    return {
        type: TYPES.GET_STRAGETY_LIST,
        list: list,
        tgid,
        slbid
    }
}

export function add_stragety(){
    return {
        type: TYPES.ADD_STRAGETY
    }
}

export function addUrls(urls){
    return {
        type: TYPES.ADD_URLS,
        urls
    }
}

export function deleteUrl(index) {
    return {
        type: TYPES.DELETE_URL,
        index
    }
}
export function addUids(uids){
    return {
        type: TYPES.ADD_UIDS,
        uids
    }
}

/**
 * 获取区域信息
 * @returns {function(*, *)}
 */
export function getCities() {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(city_url,function(err, result){
            if(err)  (getCitiesSuccess([]))
            dispatch(getCitiesSuccess(result.data))
        }))
    }
}


export function getCitiesSuccess(list) {
    return {
        type: TYPES.GET_CITIES_SUCCESS,
        cities: list
    }
}

/**
 * 获取服务器信息
 * @returns {function(*, *)}
 */
export function getServers(slbid) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(server_url+ '?slbid='+slbid,function(err, result){
            if(err)  getServersSuccess([])
            dispatch(getServersSuccess(result.data))
        }))
    }
}

export function addServers(serverkeys, servers) {
    return {
        type: TYPES.ADD_SERVERS,
        servers,
        serverkeys,
    }
}

export function getServersSuccess(list) {
    return {
        type: TYPES.GET_SERVERS_SUCCESS,
        servers: list
    }
}

export function addCities(values) {
    return {
        type: TYPES.ADD_CITIES,
        citiesselected: values
    }
}


export function deleteUid(index) {
    return {
        type: TYPES.DELETE_UID,
        index
    }
}

export function changeAddUrlType(addurltype) {
    return {
        type: TYPES.ADD_URL_TYPE,
        addurltype
    }
}

export function changeAddUidType(adduidtype) {
    return {
        type: TYPES.ADD_UID_TYPE,
        adduidtype
    }
}

/**
 * 返回到项目组
 * @returns {{type, stragety: *}}
 */
export function goback() {
    return {
        type: TYPES.GOBACK_TO_TESTINFOGROUP
    }
}

export function goback2stragelist() {
    return {
        type: TYPES.GOBACK_TO_STRAGETYLIST
    }
}

// export function () {
//     export function goback2stragelist(slbid, tgid) {
//         return dispatch(fetch.getData(stragety_url + '?tgid='+slbid,function(err, result){
//             if(!err)  getStragetyListSuccess([], undefined, tgid, slbid)
//             dispatch(goback2stragelist())
//         }))
//
//     }
// }

export function addTestGroup(group){
    return (dispatch, getState) => {
        return dispatch(fetch.postData(testgroup_url,{name: group.name, code: group.code, slbid: group.slbid}, function(err, result){
            if(err)  dispatch(postData([]))
            dispatch(fetch.getData(testgroup_url+ '?slbid='+group.slbid,function(err, result){
                if(err)  dispatch(getTestGroupListSuccess([]))
                dispatch(getTestGroupListSuccess(result.data))
            }))
        }))
    }
}

export function getTestGroupListSuccess(list) {
    return {
        type: TYPES.GET_TESTGROUP_SUCCESS,
        testgrouplist: list
    }
}





export const deleteTestSuccess = (list) => {
    return {
        type: TYPES.DELETE_TEST_SUCCESS,
        testgrouplist: list
    }
}

/**
 * 删除测试组
 * @param name
 * @returns {function(*, *)}
 */
export function deleteTest(slbid, code) {
    return (dispatch, getState) => {
        return dispatch(fetch.deleteData(testgroup_url,{code: code}, function(err, result){
            if(err)  dispatch(deleteTestSuccess([]))
            dispatch(fetch.getData(testgroup_url + '?slbid='+slbid,function(err, result){
                if(err)  deleteTestSuccess([])
                dispatch(deleteTestSuccess(result.data))
            }))
        }))
    }

}

/**
 * 获取测试项目列表
 * @returns {function(*, *)}
 */
export function getTestGroupList(slbid) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(testgroup_url + '?slbid='+slbid,function(err, result){
            if(err)  dispatch(getTestGroupListSuccess([]))
            dispatch(getTestGroupListSuccess(result.data))
        }))
    }
}

/**
 * 获取测试项目列表
 * @returns {function(*, *)}
 */
export function updateTest(where, data) {
    return (dispatch, getState) => {
        return dispatch(fetch.updateData(testgroup_url,where,data,function(err, result){
            if(err)  dispatch(getTestGroupListSuccess([]))
            dispatch(fetch.getData(testgroup_url+ '?slbid='+where.slbid,function(err, result){
                if(err)  dispatch(getTestGroupListSuccess([]))
                dispatch(getTestGroupListSuccess(result.data))
            }))
        }))
    }
}
export function validateFailure(keyval, infoval) {
    return {
        type: TYPES.VALIDATE_FAILURE,
        key: keyval,
        info: infoval
    }
}
// export function validateSuccesss() {
//     return {
//         type: VALIDATE_SUCCESS
//     }
// }

export function saveStragetyResult(result) {
    return {
        type: TYPES.SAVE_STRAGETY_RESULT,
        result
    }
}

/**
 * 验证策略详情
 * @param slbid slb编码
 * @param tgid 测试组编码
 * @param name 策略名称
 * @param desc 策略描述
 * @param cities 策略生效区域
 * @param servers 策略生效服务器
 * @param serverskey 策略生效服务器编码
 * @param urls 策略生效url
 * @param uids 策略生效uid
 * @returns {function(*=, *)}
 */
export function validate(slbid,tgid,name,desc,cities,servers,serverskey,urls,uids) {

    return (dispatch, getState) => {
        if(name === '') {
            dispatch(validateFailure('name', '请填写分流策略名称'));
        }else{
            console.log('dd')
            dispatch(fetch.getData(stragety_url+ '?slbid='+slbid,function(err, result){
                var stragetylist = result.data;
                if(stragetylist.length === 0){//如果当前slb下没有策略，则直接保存
                    return dispatch(fetch.postData(stragety_url,{slbid,tgid,name,desc,cities,servers,serverskey,urls,uids}, function(err, result){
                        if(err || result.status === 'failure')  dispatch(saveStragetyResult(false))
                        // dispatch(saveStragetyResult(true))
                        dispatch(edit_stragetylist(tgid,slbid))
                    }))
                }else{
                    var urls_of_slb = []
                        ,url_exsit = false
                        ,url_exsit_info = []
                        ,url_matched = false
                        ,url_matched_info=[]
                        ,server_exsit=false;
                    //判断新加urls是否与以上重复
                    stragetylist.map((stragety)=>{
                        var urllist = stragety.stra_urls.split(';');
                        urllist.map((url)=>{
                            if(urls_of_slb.length ===0 || (url && urls_of_slb.indexOf(url) !==-1)){
                                urls_of_slb.push(url)
                            }
                        })
                        // urls_of_slb = urls_of_slb.concat(stragety.stra_urls.split(';'));
                    })
                    if(urls.length !==0) {//填写了url
                        urls.map((url)=>{
                            if(urls_of_slb.indexOf(url) !==-1){
                                url_exsit = true;
                                url_exsit_info.push(url)
                            }
                        })
                        if(url_exsit){//如果url已重复
                            //server是否与重复urls策略服务器们重复
                            url_exsit_info.map((url)=>{
                                stragetylist.map((stragety)=>{
                                    if(stragety.stra_urls.split(';').indexOf(url) !==-1){
                                        servers.map((server)=>{
                                            if(stragety.stra_servers.split(';').indexOf(server) !==-1){
                                                server_exsit = true
                                            }
                                        })

                                    }
                                })
                            })
                        }else{//如果url不重复，看是否包含
                            urls_of_slb.map((url_of_slb)=>{
                                urls.map((url)=>{
                                    if(url.match(url_of_slb)){//包含
                                        url_matched = true;
                                        url_matched_info.push({
                                            url: url,
                                            url_of_slb: url_of_slb
                                        })
                                    }
                                })
                            })
                        }

                        if((!url_exsit && !url_matched) || (url_exsit && !server_exsit)) {//如果不重复也不包含，则直接保存 || 重复，server不重复，直接保存
                            return dispatch(fetch.postData(stragety_url,{slbid,tgid,name,desc,cities,servers,serverskey,urls,uids}, function(err, result){
                                if(err || result.status === 'failure')  dispatch(saveStragetyResult(false))
                                dispatch(edit_stragetylist(tgid,slbid))
                            }))
                        }else if(!url_exsit && url_matched){//url不重复，url包含，则不让保存
                            dispatch(validateFailure('url', 'url与已经设置的url存在包含关系，请确认后重新添加（规则：url不能存在包含关系）'));
                        }else if(url_exsit && server_exsit){//url重复，机器重复，不让保存
                            dispatch(validateFailure('url','您选择的分流服务器已经设置了相同的url。请换一台分流服务器或修改url（规则：url和分流服务器至少有一个不相同）'
                            ));
                        }

                    }else if(uids.length !==0 || cities.length !==0) {//没填写url,填写uid或区域信息
                        stragetylist.map((stragety)=>{
                            if(!stragety.stra_urls){//url为空
                                servers.map((server)=>{
                                    if(stragety.stra_servers.split(';').indexOf(server) !==-1){
                                        server_exsit = true
                                    }
                                })

                            }
                        })
                        if(server_exsit){
                            dispatch(validateFailure('server','分流服务器已经被占用（规则：url为空时，必须选择未被占用的分流服务器）'
                            ));
                        }else{
                            return dispatch(fetch.postData(stragety_url,{slbid,tgid,name,desc,cities,servers,serverskey,urls,uids}, function(err, result){
                                if(err || result.status === 'failure')  dispatch(saveStragetyResult(false))
                                dispatch(edit_stragetylist(tgid,slbid))
                            }))
                        }
                    }else{//没填写url,也没填写uid
                        // 不让保存
                        dispatch(validateFailure('url,uid','url、uid至少选择一项'
                        ));
                    }
                }
            }))
        }

    }

}


export function handleStragety(stra_id, status) {
    return (dispatch, getState) => {
        return dispatch(fetch.updateData(stragety_url,{stra_id: stra_id}, {stra_status: status}, function(err, result){
            if(err)  dispatch(changeStragetyStatus())
            // dispatch(fetch.getData(testgroup_url+ '?slbid='+group.slbid,function(err, result){
            //     if(!err)  getTestGroupListSuccess([])
                dispatch(changeStragetyStatus(stra_id, status))
            // }))
        }))
    }
}

/**
 * 删除策略
 * @param stra_id
 * @returns {function(*=, *)}
 */
export function deleteStragety(stra_id, slbid, tgid) {
    return (dispatch, getState) => {
        return dispatch(fetch.deleteData(stragety_url,{code: stra_id}, function(err, result){
            dispatch(edit_stragetylist(tgid, slbid))
        }))
    }
}

export function changeStragetyStatus(stra_id, status) {
    return {
        type: TYPES.CHANGE_STRAGETY_STATUS,
        status,
        stra_id
    }
}


export function editStragety(stragety) {
    return {
        type: TYPES.EDIT_STRAGETY,
        stragety
    }
}

/**
 * 为策略生成标签
 */
export function generateTags(slbid, tgid) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(tag_url + '?slbid='+slbid + '&tgid='+tgid,function(err, result){
            if(err)  (freshStragetylist([]))
            dispatch(freshStragetylist(result.data))
        }))
    }
}

/**
 * 刷新策略列表
 * @param stragetylist
 * @returns {{type, stragetylist: *}}
 */
export function freshStragetylist(stragetylist) {
    return {
        type: TYPES.FRESH_STRAGETYLIST,
        stragetylist
    }
}

/**
 * 发布到服务器
 */
export function publish(slbid) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(slb_publish_url + '?slbid='+slbid,function(err, result){
            if(err)  (publishresult(false))
            dispatch(publishresult(result.data))
        }))
    }

}

export function publishresult() {
    return {
        type: TYPES.PUBLISH
    }
}
