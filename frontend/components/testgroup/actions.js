import * as TYPES from './constants';
import fetch from '../../fetch'

const testgroup_url = 'http://localhost:3000/testgroup'

/**
 * 进入编辑策略页面
 * @returns {{type}}
 */
export function edit_stragety(stragety) {
    return {
        type: TYPES.EDIT_STRAGETY_INFO,
        stragety: stragety
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

export function addTestGroup(group){
    return (dispatch, getState) => {
        return dispatch(fetch.postData(testgroup_url,{name: group.name, code: group.code, slbid: group.slbid}, function(err, result){
            if(!err)  postData([])
            dispatch(fetch.getData(testgroup_url,function(err, result){
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
export function deleteTest(code) {
    return (dispatch, getState) => {
        return dispatch(fetch.deleteData(testgroup_url,{code: code}, function(err, result){
            if(!err)  deleteTestSuccess([])
            dispatch(fetch.getData(testgroup_url,function(err, result){
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
export function getTestGroupList() {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(fetch.getData(testgroup_url,function(err, result){
            if(!err)  getTestGroupListSuccess([])
            dispatch(deleteTestSuccess(result.data))
        }))
    }
}

/**
 * 获取测试项目列表
 * @returns {function(*, *)}
 */
export function updateTest(where, data) {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(fetch.updateData(testgroup_url,where,data,function(err, result){
            if(!err)  getTestGroupListSuccess([])
            dispatch(fetch.getData(testgroup_url,function(err, result){
                if(!err)  getTestGroupListSuccess([])
                dispatch(getTestGroupListSuccess(result.data))
            }))
        }))
    }
}

