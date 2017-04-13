import * as TYPES from './constants'
import utilscomps from '../utilscomps'
const initState = {
    showtype: 'webServerList',
    webServerList: []
};
const webServerReducer = (state = initState,action) => {
    switch (action.type){
        case 'WEBSERVERLIST' : {
            return Object.assign({},state,{
                webServerList: action.webServerList
            })
            break
        }
        case 'DELETE_WEBSERVERLIST' : {
            return Object.assign({},state,{
                webServerList: action.webServerList
            })
            break
        }
        case 'CURRENT_SLB_NAME' : {
            return Object.assign({},state,{
                current_slb_name: action.name
            })
        }
            break
        case TYPES.SHOW_NOTIFICATION :
            utilscomps.showNotification(action.showtype, action.title,action.content);
            return  state;
            break
        case TYPES.SET_REFER_SERVER_SUCCESS : {
            var servers = action.servers,
                status = action.status;
            state.webServerList.map((server)=>{
                if(servers.indexOf(server.key) !== -1){
                    server.refer = status;
                    if(!status) server.stragetiesinfo =  []

                }
            })
            utilscomps.showNotification('warning', '必要操作提示', '请去对应的测试组内重新点击"生成基准版本按钮"使操作生效！');
            return Object.assign({},state,{
                webServerList: state.webServerList
            })
            break
        }
        default:
            return state;
    }
}
export default webServerReducer;