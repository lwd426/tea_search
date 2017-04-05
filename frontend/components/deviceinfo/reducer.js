
const initState = {
    showtype: 'webServerList',
    webServerList: [],
};
const webServerReducer = (state = initState,action) => {
    switch (action.type){
        case 'WEBSERVERLIST' : {
            return Object.assign({},state,{
                webServerList: action.webServerList,
            })
        }
        case 'DELETE_WEBSERVERLIST' : {
            return Object.assign({},state,{
                webServerList: action.webServerList,
            })
        }
        default:
            return state;
    }
}
export default webServerReducer;