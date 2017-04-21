import * as TYPES from './constants'
import fetch from '../../utils/fetch'
const HOST = require('../../../config').HOST;
const slb_list_url = HOST + '/slb'
import * as tgActions from '../../components/testgroup/actions'


/**
 * 获取slb列表
 * @returns {function(*, *)}
 */
export function getMenulist() {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(fetch.getData(slb_list_url,function(err, result){
            if(!err)  getMenuListSuccess([])
            dispatch(getMenuListSuccess(result.data))
        }))
    }
}

/**
 * 删除测试组
 * @param name
 * @returns {function(*, *)}
 */
export function deleteTestGroup(id) {
    return (dispatch, getState) => {
        return dispatch(fetch.deleteData(slb_list_url,{id: id}, function(err, result){
            if(err)  deleteMenuSuccess([])
            dispatch(fetch.getData(slb_list_url,function(err, result){
                if(err)  deleteMenuSuccess([])
                dispatch(deleteMenuSuccess(result.data))
            }))
        }))
    }

}

/**
 * 新增测试组
 * @param name
 * @returns {function(*, *)}
 */
export function saveMenu(name) {
    return (dispatch, getState) => {
        return dispatch(fetch.postData(slb_list_url,{name}, function(err, result){
            if(!err)  postData([])
            dispatch(fetch.getData(slb_list_url,function(err, result){
                if(!err)  getMenuListSuccess([])
                dispatch(getMenuListSuccess(result.data))
            }))
        }))
    }
}

export function editSlb(slbid, slbname) {
    return (dispatch, getState) => {
        return dispatch(fetch.updateData(slb_list_url,{objectId: slbid}, {name: slbname}, function(err, result){
            if(!err)  editMenuListSuccess([])
            dispatch(fetch.getData(slb_list_url,function(err, result){
                if(!err)  editMenuListSuccess([])
                dispatch(editMenuListSuccess(result.data))
            }))
        }))
    }
}

export const editMenuListSuccess = (menulist) => {
    return {
        type: TYPES.EDIT_MENUDATA_SUCCESS,
        menulist
    }
}

export function editSlbClick(slbid, slbname) {
    return {
        type: TYPES.EDIT_SLB_CLICK,
        slbid,
        slbname
    }
}

// export function changeSlb(slbid){
//     return {
//         type: TYPES.CHANGE_SLB,
//         slbid: slbid
//     }
// }

export function changeShowWinType(slbid, wintype) {
    //读取slb信息
    return (dispatch, getState) => {
        if(!slbid) return dispatch(changeSlbSuccess(wintype, undefined, undefined, undefined));
        return dispatch(fetch.getData(slb_list_url + '?objectId=' + slbid,function(err, result){
            if(err) return dispatch(changeSlbSuccess(''));
            var arr = result.data;
            var domain = arr[0].slbDomain;
            var domainId = arr[0].domainId;
            dispatch(tgActions.goback())
            return dispatch(changeSlbSuccess(wintype, slbid, domain, domainId));
        }))
    }
}

export function changeSlbSuccess(wintype, slbid, domain, domainId) {
    return {
        type: TYPES.CHANGE_SLB_SUCCESS,
        wintype,
        slbid,
        domain,
        domainId
    }
}

export function addTestGroup(){
    return  {
        type: TYPES.ADD_TEST_GROUP
    }
}

export function cancelAddTestGroup(){
    return  {
        type: TYPES.CANCEL_ADD_TEST_GROUP
    }
}

export const saveMenuSuccess = (menulist) => {
    return {
        type: TYPES.SAVE_MENU_SUCCESS,
        menulist
    }
}

export const deleteMenuSuccess = (menulist) => {
    return {
        type: TYPES.DELETE_MENU_SUCCESS,
        menulist
    }
}

export const getMenuListSuccess = (menulist) => {
    return {
        type: TYPES.GET_MENUDATA_SUCCESS,
        menulist
    }
}

export function changeMenu(slbid, wintye) {

}






