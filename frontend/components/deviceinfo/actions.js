import * as TYPES from './constants'
import fetch from '../../fetch'
const HOST = require('../../../config').HOST;

const slb_list_url = HOST + '/slb';
const web_list_url = HOST + '/webserver';
/**
 * 获取SLB名称
 * @returns {function(*, *)}
 */
export function getSLB(objectId) {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(slb_list_url + '?objectId=' + objectId,function(err, result){
            if(err) return dispatch(getSlbName(''));
            var arr = result.data;
            var name = arr[0].slbDomain;
            return dispatch(getSlbName(name));
        }))
    }
}

export function getSlbName(name){
    return {
        type: TYPES.CURRENT_SLB_NAME,
        name
    }
}

export function updateSLB(objectId, slbDomain) {
    return (dispatch, getState) => {
        return dispatch(fetch.updateData(slb_list_url,{objectId: objectId}, {slbDomain: slbDomain}, function(err, result){
            if(err){
                return false;
            }
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
                ip: '',
                stragetyname: '',
                address: '',
                backup: '',
                refer: false
            }, function(err, result){
            if(err)  return dispatch(postData([]))
            return dispatch(fetch.getData(web_list_url + '?slbid=' + group.slbid,function(err, result){
                if(err) return dispatch(updateWebServerList([]));
                return dispatch(updateWebServerList(result.data));
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
export function deleteWebServer(server) {
    return (dispatch, getState) => {
        return dispatch(fetch.deleteData(web_list_url,{key: server.key}, function(err, result){
            if(err) return dispatch(deleteWebServerList([]))
            if(result.status === 'success'){
                return dispatch(fetch.getData(web_list_url+ '?slbid=' + server.slbid,function(err, result){
                    if(err)  dispatch(deleteWebServerList([]))
                    dispatch(deleteWebServerList(result.data))
                }))
            }else{
                return dispatch(showNotification('不能删除！', result.data.info, 'error'))
            }

        }))
    }

}

export function showNotification(title, content, type) {
     console.log(content)
     return {
         type: TYPES.SHOW_NOTIFICATION,
         title: title,
         content: content,
         showtype: type
     }
}

/**
 * 更新 web服务器
 * @returns {function(*, *)}
 */
export function updateWebServer(where, data) {
    return (dispatch, getState) => {
        return dispatch(fetch.updateData(web_list_url,where,data,function(err, result){
            if(err) return dispatch(updateWebServerList([]))
            return dispatch(fetch.getData(web_list_url + '?slbid='+ where.slbid,function(err, result){
                if(err)  updateWebServerList([])
                return dispatch(updateWebServerList(result.data))
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
            if(err)  return dispatch(updateWebServerList([]))
            //console.log(result)
            return dispatch(updateWebServerList(result.data))
        }))
    }
}

/**
 * 设置基准服务器
 * @param servers
 */
export function setReferServers(servers, status) {
    return (dispatch, getState) => {
        return dispatch(fetch.updateData(web_list_url+ '/refer',{data:servers},{'refer':status},function(err, result){
            if(err || !result.data)  return dispatch(setReferServersSuccess([]))
            return dispatch(setReferServersSuccess(servers, status))
        }))
    }
}

export function setReferServersSuccess(servers, status) {
    return {
        type: TYPES.SET_REFER_SERVER_SUCCESS,
        servers,
        status
    }
}
