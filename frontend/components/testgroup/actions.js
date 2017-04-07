import * as TYPES from './constants';
import fetch from '../../fetch'

const testgroup_url = '/testgroup'
const stragety_url = '/stragety'
const city_url = '/city'
const server_url = '/webserver'

/**
 * 进入编辑策略页面
 * @returns {{type}}
 */
export function edit_stragetylist(tgid, slbid) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(stragety_url + '?tgid='+tgid,function(err, result){
            if(!err)  getStragetyListSuccess([], tgid, slbid)
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

export function add_stragety(stragetyid, tgid, slbid){
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
            if(!err)  getCitiesSuccess([])
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
            if(!err)  getServersSuccess([])
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
            if(!err)  postData([])
            dispatch(fetch.getData(testgroup_url+ '?slbid='+group.slbid,function(err, result){
                if(!err)  getTestGroupListSuccess([])
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
            if(!err)  deleteTestSuccess([])
            dispatch(fetch.getData(testgroup_url + '?slbid='+slbid,function(err, result){
                if(!err)  deleteTestSuccess([])
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
            if(!err)  getTestGroupListSuccess([])
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
            if(!err)  getTestGroupListSuccess([])
            dispatch(fetch.getData(testgroup_url+ '?slbid='+where.slbid,function(err, result){
                if(!err)  getTestGroupListSuccess([])
                dispatch(getTestGroupListSuccess(result.data))
            }))
        }))
    }
}
export function validateFailure(params) {
    return {
        type: VALIDATE_FAILURE,
        params
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

export function validate(slbid,tgid,name,desc,cities,servers,urls,uids) {
    if(name === '') dispatch(validateFailure('name'));
    console.log('d')
    return (dispatch, getState) => {
        dispatch(fetch.getData(stragety_url+ '?slbid='+slbid,function(err, result){
            // if(result.data.length === 0){//如果当前slb下没有策略，则直接保存
                return dispatch(fetch.postData(stragety_url,{slbid,tgid,name,desc,cities,servers,urls,uids}, function(err, result){
                    if(err || result.status === 'failure')  dispatch(saveStragetyResult(false))
                    // dispatch(saveStragetyResult(true))
                    dispatch(edit_stragetylist(tgid,slbid))
                }))
            // }else{
            //     if(urls.length !==0) {//填写了url
                    // 查询本slb下所有的url信息（包括对应的机器key）(也就是查询当前slb下所有的策略信息列表)
                    //
                // }else if(uids.length !==0 || cities.length !==0) {//没填写url,填写uid或区域信息
                    //
                // }else{//没填写url,也没填写uid
                    // 不让保存
                    // return false;
                // }
            // }

            // if(!err)  getTestGroupListSuccess([])
            // dispatch(getTestGroupListSuccess(result.data))
        }))
    }

}

