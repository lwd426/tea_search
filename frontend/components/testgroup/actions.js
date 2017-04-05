import * as TYPES from './constants';
import fetch from '../../fetch'

const testgroup_url = 'http://localhost:3000/testgroup'
const stragety_url = 'http://localhost:3000/stragety'

/**
 * 进入编辑策略页面
 * @returns {{type}}
 */
export function edit_stragetylist(stragety) {
    return (dispatch, getState) => {
        var testgroupid = stragety.key;
        var slbid = stragety.slbid;
        return dispatch(fetch.getData(stragety_url + '?tgid='+testgroupid,function(err, result){
            if(!err)  getStragetyListSuccess([], testgroupid, slbid)
            dispatch(getStragetyListSuccess(result.data, testgroupid, slbid))
        }))
    }
}

export function getStragetyListSuccess(list, stragetyid, testgroupid, slbid){
    return {
        type: TYPES.GET_STRAGETY_LIST,
        list: list,
        tgid: testgroupid,
        slbid,
        stragetyid
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

