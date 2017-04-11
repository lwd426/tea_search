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
            var servers = action.servers,
                status = action.status;
            console.log('dd')
            state.webServerList.map((server)=>{
                if(servers.indexOf(server.key) !== -1){
                    server.refer = status
                }
            })
            return Object.assign({},state,{
                webServerList: state.webServerList
            })
        }
        default:
            return state;
    }
}
export default webServerReducer;