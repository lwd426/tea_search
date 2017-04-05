import * as TYPES from './constants'
import fetch from '../../fetch'
const slb_list_url = 'http://localhost:3000/slb';
const web_list_url = 'http://localhost:3000/webserver';

export function updateSLB(objectId, slbDomain) {
    return (dispatch, getState) => {
        return dispatch(fetch.updateData(slb_list_url,{objectId: 'I4WN52Sb7j'}, {slbDomain: slbDomain}, function(err, result){
            console.log(err)
            if(!err){
                return false;
            }
            console.log(result)
            //dispatch(getMenuListSuccess(result.data.results))
        }))
    }
}

export const getMenuListSuccess = (menulist) => {
    return {
        type: TYPES.GET_MENUDATA_SUCCESS,
        menulist
    }
}

function updateWebServerList(list) {
    return {
        type: TYPES.WEBSERVERLIST,
        webServerList: list
    }
}

export function addWebServer(group){
    return (dispatch, getState) => {
        return dispatch(fetch.postData(web_list_url,{
                key: group.key, 
                slbid: group.slbid, 
                ip: group.ip, 
                stragetyname: group.stragetyname,
                address: group.address,
                backup: group.backup,
                refer: group.refer
            }, function(err, result){
            if(!err)  postData([])
                console.log('ddddd')
            dispatch(fetch.getData(web_list_url + '?slbid=' + group.slbid,function(err, result){
                if(!err) updateWebServerList([]);
                dispatch(updateWebServerList(result.data));
            }))
        }))
    }
}

/**
 * 删除 web服务器
 * @param name
 * @returns {function(*, *)}
 */
 function deleteWebServerList(list){
    return {
        type: TYPES.DELETE_WEBSERVERLIST,
        webServerList: list
    }
}
export function deleteWebServer(key) {
    return (dispatch, getState) => {
        console.log(key)
        return dispatch(fetch.deleteData(web_list_url,{key: key}, function(err, result){
            if(!err)  deleteWebServerList([])
            dispatch(fetch.getData(web_list_url,function(err, result){
                if(!err)  deleteWebServerList([])
                dispatch(deleteWebServerList(result.data))
            }))
        }))
    }

}

/**
 * 更新 web服务器
 * @returns {function(*, *)}
 */
export function updateWebServer(where, data) {
    return (dispatch, getState) => {
        return dispatch(fetch.updateData(web_list_url,where,data,function(err, result){
            if(!err)  updateWebServerList([])
            dispatch(fetch.getData(web_list_url + '?slbid='+ where.slbid,function(err, result){
                if(!err)  updateWebServerList([])
                dispatch(updateWebServerList(result.data))
            }))
        }))
    }
}

/**
 * 获取web服务器列表
 * @returns {function(*, *)}
 */
export function getWebServerList(slbid) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(web_list_url + '?slbid='+slbid,function(err, result){
            if(!err)  updateWebServerList([])
            //console.log(result)
            dispatch(updateWebServerList(result.data))
        }))
    }
}