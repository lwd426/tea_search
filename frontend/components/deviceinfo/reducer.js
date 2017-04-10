import * as TYPES from './constants'
const initState = {
    showtype: 'webServerList',
    webServerList: [],
};
const webServerReducer = (state = initState,action) => {
    switch (action.type){
        case 'WEBSERVERLIST' : {
            return Object.assign({},state,{
                webServerList: action.webServerList
            })
        }
        case 'DELETE_WEBSERVERLIST' : {
            return Object.assign({},state,{
                webServerList: action.webServerList
            })
        }
        case 'CURRENT_SLB_NAME' : {
            return Object.assign({},state,{
                current_slb_name: action.name
            })
        }
        case TYPES.SET_REFER_SERVER_SUCCESS : {
            var servers = action.servers;
            var serverlist = webServerList.map((server)=>{
                if(servers.indexOf(server.key)){
                    server.refer = true
                }else{
                    server.refer = false
                }
                return server;
            })
            return Object.assign({},state,{
                webServerList: serverlist
            })
        }
        default:
            return state;
    }
}
export default webServerReducer;