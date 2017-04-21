import * as TYPES from './constants';
import fetch from '../../utils/fetch'
import checkUrl from '../../utils/checkUrl'
const HOST = require('../../../config').HOST;
import utilscomps from '../utilscomps'
import * as contActions from '../../layout/content/actions'
const testgroup_url = HOST + '/testgroup'
const versionlog_url = HOST + '/versionlog'
const stragety_url = HOST + '/stragety'
const city_url = HOST + '/city'
const server_url = HOST + '/webserver'
const tag_url = HOST + '/stragety/tag'
const slb_publish_url = HOST + '/slb/publish'
const stragety_start_url = HOST + '/stragety/handler'

/**
 * 进入编辑策略页面
 * @returns {{type}}
 */
export function edit_stragetylist(tgid, slbid) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(stragety_url + '?slbid='+slbid+'&tgid='+tgid,function(err, result){
            if(err)  return dispatch(getStragetyListSuccess([], tgid, slbid))
            return dispatch(getStragetyListSuccess(result.data, tgid, slbid))
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
            if(err) return dispatch(getCitiesSuccess([]))
            return dispatch(getCitiesSuccess(result.data))
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
            if(err)  return  dispatch(getServersSuccess([]))
            return dispatch(getServersSuccess(result.data))
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
            if(err || result.status ==='failure') {
                utilscomps.showNotification('error', '失败', '添加失败，失败原因：'+result.data );
            }else{
                return dispatch(fetch.getData(testgroup_url+ '?slbid='+group.slbid,function(err, result){
                    if(err)  return dispatch(getTestGroupListSuccess([]))
                    dispatch(contActions.setAddTgModalStatus(false))
                    utilscomps.showNotification('success', '新建成功', '策略组已经新建成功！', 1);
                    return dispatch(getTestGroupListSuccess(result.data))
                }))
            }
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
            if(err || result.status ==='failure') {
                return utilscomps.showNotification('error', '失败', '添加失败，失败原因：'+result.data );
            }else{
                utilscomps.showNotification('success', '成功', '删除成功！', 1 );
                return dispatch(fetch.getData(testgroup_url + '?slbid='+slbid,function(err, result){
                    if(err)  return dispatch(deleteTestSuccess([]))
                    return dispatch(deleteTestSuccess(result.data))
                }))
            }

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
            if(err)  return dispatch(getTestGroupListSuccess([]))
            return dispatch(getTestGroupListSuccess(result.data))
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
            if(err)  return dispatch(getTestGroupListSuccess([]))
            return dispatch(fetch.getData(testgroup_url+ '?slbid='+where.slbid,function(err, result){
                if(err)  return dispatch(getTestGroupListSuccess([]))
                return dispatch(getTestGroupListSuccess(result.data))
            }))
        }))
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

export function validateFailure(keyval, infoval) {
    return {
        type: TYPES.VALIDATE_FAILURE,
        key: keyval,
        info: infoval
    }
}

function dataHandler(dispatch, ha,stra_id, slbid,tgid,name,desc,cities,servers,serverskey,urls,uids,type){
    if(ha === 'save'){
        return dispatch(fetch.postData(stragety_url,{slbid,tgid,name,desc,cities,servers,serverskey,urls,uids,type}, function(err, result){
            if(err || result.status === 'failure')  return dispatch(saveStragetyResult(false))
            return dispatch(edit_stragetylist(tgid,slbid))
        }))
    }else{
        var where = {
            stra_id
        },
        data = {
            stra_name: name,
            stra_desc: desc,
            stra_cities: cities,
            stra_servers: servers,
            stra_serverskey: serverskey,
            stra_urls: urls,
            stra_uids: uids,
            type: type,
            slbid: slbid
        }
        return dispatch(fetch.updateData(stragety_url,where, data, function(err, result){
            if(err || result.status === 'failure')  return dispatch(saveStragetyResult(false))
            return dispatch(edit_stragetylist(tgid,slbid))
        }))
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
export function validate(editting_status, slbid,tgid,name,desc,cities,servers,serverskey,urls,uids) {
    return (dispatch, getState) => {
        var optType = 'save', stra_id = '';
        if(editting_status) {
            optType = 'update';
            stra_id = editting_status;
        }
        if(name === '') {
            return dispatch(validateFailure('name', '请填写分流策略名称'));
        }else if(urls.length === 0){
            return dispatch(validateFailure('url', '请填写至少一个url'));
        }else{
            var type = 'normal'
            return dispatch(fetch.getData(stragety_url+ '?slbid='+slbid,function(err, result){
                var stragetylist = result.data;
                if(stragetylist.length === 0){//如果当前slb下没有策略，则直接保存
                    dataHandler(dispatch, optType, stra_id, slbid,tgid,name,desc,cities,servers,serverskey,urls,uids,type)
                }else{
                    var urls_of_slb = []
                        ,uids_of_slb = []
                        ,regions_of_slb = []
                        ,url_exsit = false
                        ,url_exsit_info = []
                        ,url_matched = false
                        ,url_matched_info=[]
                        ,server_exsit=false
                        ,uid_exsit_info=[]
                        ,uid_exsit = false
                        ,region_exsit_info = []
                        ,region_exsit = false;
                    //遍历获得slb下所有的不重复urls、uid或区域数组
                    stragetylist.map((stragety)=>{
                        var urllist = stragety.stra_urls;
                        var uidlist = stragety.stra_uids;
                        var regionlist = stragety.stra_cities;
                        urllist.map((url)=>{
                            if(url && urls_of_slb.indexOf(url) !==-1){
                                urls_of_slb.push(url)
                            }
                        })
                        uidlist.map((uid)=>{
                            if(uid && uids_of_slb.indexOf(uid) !==-1){
                                uids_of_slb.push(uid)
                            }
                        })
                        regionlist.map((region)=>{
                            if(region && regions_of_slb.indexOf(region) !==-1){
                                regions_of_slb.push(region)
                            }
                        })
                    })
                    urls.map((url)=>{
                        if(!checkUrl(url)) { //如果url不合法
                            return dispatch(validateFailure('url', '存在不合法的url'));
                        }else if(urls_of_slb.indexOf(url) !==-1){//url是否重复
                            url_exsit = true;
                            url_exsit_info.push(url)
                        }else if(checkUrl(url, urls_of_slb)){//url是否包含
                            url_matched = true;
                            url_matched_info.push({
                                url: url,
                                urls_of_slb: urls_of_slb
                            })
                        }
                    })
                    if(url_exsit || url_matched){//如果url已重复 || 包含
                        //与slb下的uid或区域是否重复
                        uids.map((uid)=>{
                            if(uids_of_slb.indexOf(uid) !==-1) {//url是否重复
                                uid_exsit = true;
                                uid_exsit_info.push(uid)
                            }
                        });
                        cities.map((city)=>{
                            if(regions_of_slb.indexOf(city) !==-1) {//url是否重复
                                region_exsit = true;
                                region_exsit_info.push(city)
                            }
                        });
                        if(uid_exsit) {//如果uid或区域重复，则不让保存
                            return dispatch(validateFailure('uid', '您设置的uid已经被配置到其他测试项目，请修改url或uid后重新添加（规则：url和已存在的url存在重复或包含关系时，uid不能重复）'));
                        }else if(region_exsit) {//如果区域重复，则不让保存
                            return dispatch(validateFailure('region', '您设置的区域已经被配置到其他测试项目（规则：url和已存在的url存在重复或包含关系时，region不能重复）'));
                        }else{
                            //server是否与重复urls策略服务器们重复
                            url_exsit_info.map((url)=>{
                                stragetylist.map((stragety)=>{
                                    if(stragety.stra_urls.indexOf(url) !==-1){
                                        servers.map((server)=>{
                                            if(stragety.stra_servers.indexOf(server) !==-1){
                                                server_exsit = true
                                            }
                                        })

                                    }
                                })
                            })
                            if((url_exsit || url_matched) && !server_exsit){ //url有冲突，但server不重复，保存成功
                                // return dispatch(fetch.postData(stragety_url,{slbid,tgid,name,desc,cities,servers,serverskey,urls,uids,type}, function(err, result){
                                //     if(err || result.status === 'failure')  return dispatch(saveStragetyResult(false))
                                //     return dispatch(edit_stragetylist(tgid,slbid))
                                // }))
                                dataHandler(dispatch, optType, stra_id, slbid,tgid,name,desc,cities,servers,serverskey,urls,uids,type)

                            }else{//url冲突，机器重复，不让保存
                                return dispatch(validateFailure('url','您选择的分流服务器已经设置了相同的url。请换一台分流服务器或修改url（规则：url和分流服务器至少有一个不相同）'));
                            }
                        }

                    }else{//url没重复、没包含关系
                        dataHandler(dispatch, optType, slbid,tgid,name,desc,cities,servers,serverskey,urls,uids,type)

                        // return dispatch(fetch.postData(stragety_url,{slbid,tgid,name,desc,cities,servers,serverskey,urls,uids,type}, function(err, result){
                        //         if(err || result.status === 'failure')  return dispatch(saveStragetyResult(false))
                        //         return dispatch(edit_stragetylist(tgid,slbid))
                        //     }))
                        }

                }
            }))
        }

    }

}


export function handleStragety(slbid, tgid, stra_id, status) {
    return (dispatch, getState) => {
        //先更新重新发布
        return dispatch(fetch.getData(stragety_start_url + '?tgid='+tgid+'&slbid='+slbid + '&status='+status,function(err, result){
            //发布失败，告知用户
            if(err)  return dispatch(publishresult(false))
            //如果发布成功，则更新策略状态
            return dispatch(fetch.updateData(stragety_url,{stra_id: stra_id}, {stra_status: status}, function(err, result){
                if(err)  dispatch(changeStragetyStatus())

                dispatch(changeStragetyStatus(stra_id, status))
            }))
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
            if(err || result.status ==='failure') {
                return utilscomps.showNotification('error', '失败', '添加失败，失败原因：'+result.data );
            }else{
                utilscomps.showNotification('success', '成功', '删除成功！', 1 );
                return dispatch(edit_stragetylist(tgid, slbid))
            }
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
export function publish(domainId,slbid, tgid, versionnum, versiondesc) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(slb_publish_url + '?domainId='+domainId+ '&slbid='+slbid + '&tgid='+ tgid +'&versionnum='+versionnum + '&versiondesc='+versiondesc,function(err, result){
            if(err || result.status === 'failure')  {
                dispatch(publishSuccess(false, result.data))
            }else{
                dispatch(publishSuccess(true, result.data))
                return dispatch(edit_stragetylist(tgid, slbid))
            }


        }))
    }

}


export function publishModal(status) {
    return {
        type: TYPES.PUBLISH_MODAL,
        status
    }
}

export function publishSuccess(status, data) {
    return {
        type: TYPES.PUBLISH_SUCCESS,
        status,
        data
    }
}


export function generateReferVersion(version) {
    return (dispatch, getState) => {
        var slbid = version.slbid;
        var tgid = version.tgid;
        var name = version.name;
        var desc = version.desc;
        var cities = version.cities;
        var servers = version.servers;
        var serverskey = version.serverskey;
        var urls = version.urls;
        var uids = version.uids;
        var type = 'refer';
        return dispatch(fetch.postData(stragety_url, {
            slbid,
            tgid,
            name,
            desc,
            cities,
            servers,
            serverskey,
            urls,
            uids,
            type
        }, function (err, result) {
            if (err || result.status === 'failure') {
                return utilscomps.showNotification('error', '失败', '添加失败，失败原因：'+result.data,3 );
            }else{
                utilscomps.showNotification('success', '成功', '基准版本生成成功！' );
                return dispatch(edit_stragetylist(tgid, slbid))
            }
        }))
    }
}

export function updateStragety(stra_id, tgid , slbid,  data) {
    return (dispatch, getState) => {
        //更新策略信息
        return dispatch(fetch.updateData(stragety_url,{stra_id},data,function(err, result){
            //更新机器信息 - 添加策略名到新机器上
            return dispatch(fetch.updateData(server_url, {other:{opt: 'in', key: 'key', data:data.stra_serverskey}, type:'add'},{'stragetiesinfo':stra_id},function(err, result){
                if(err)  dispatch(getTestGroupListSuccess([]))
                return dispatch(fetch.getData(stragety_url + '?tgid='+tgid,function(err, result){
                    if(err)  dispatch(getStragetyListSuccess([], tgid, slbid))
                    dispatch(getStragetyListSuccess(result.data, tgid, slbid))
                }))
            }))
        }))
    }
}

export function versionlog_list(tgid, slbid) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(versionlog_url + '?tgid='+tgid,function(err, result){
            if(err)  return dispatch(getVersionListSuccess([], tgid, slbid))
            return dispatch(getVersionListSuccess(result.data, tgid, slbid))
        }))
    }
}

export function getVersionListSuccess(list, tgid,slbid) {
    return {
        type: TYPES.GET_VERSIONLOG_SUCCESS,
        list
    }
}
/**
 * 回滚到测试组指定该版本
 * @param slbid
 * @param tgid
 * @param versionkey
 */
export function publishback(domainId, slbid, tgid, versionkey) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(slb_publish_url + '/back?domainId='+domainId+ '&slbid='+slbid + '&tgid='+ tgid +'&versionkey='+versionkey ,function(err, result){
            if(err || result.status === 'failure')  return dispatch(publishSuccess(false, result.data))
            dispatch(publishSuccess(true, result.data));
            return dispatch(versionlog_list(tgid, slbid))
        }))
    }
}