
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
            console.log(action.name)
            return Object.assign({},state,{
                current_slb_name: action.name
            })
        }
        default:
            return state;
    }
}
export default webServerReducer;