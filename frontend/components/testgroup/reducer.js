//处理数字增加的reducer
import * as TYPES from './constants'
const initialState = {
    showtype: 'testgroup', //content展示类型
    slbid: '',//当前所处的slbid
    citiesselected: [],//已选择区域
    serverselected: [],//已选择服务器
    serverselectedkeys: [], //已选择的服务器编码
    addurls: [],//已添加url
    adduids: [],//已添加uid
    tgid: '',//测试组id
    cities: [],//城市列表
    servers: [],//服务器
    // serverlist: [],//服务器列表
    addurltype: 'multiple',
    adduidtype: 'multiple',
    stragety: {},//当前所处策略
    testgrouplist: [],//当前所处测试组列表
    stragetylist: []//当前所处策略列表
    ,validatestatus: 'failure' //保存策略时验证的状态
    ,savestragetystatus: false //保存策略状态(启动或停止使用)
    ,editting_stragety: undefined //正在编辑的策略
}

let reducer = (state = initialState, action)=> {
    switch (action.type) {
        case TYPES.STRAGETY_LIST:
            return Object.assign({}, state, {stragety: action.stragety, showtype: 'stragety'})
            break
        case TYPES.GOBACK_TO_TESTINFOGROUP:
            return Object.assign({}, state, {showtype: 'testgroup'})
            break
        case TYPES.GOBACK_TO_STRAGETYLIST:
            return Object.assign({}, state, {showtype: 'stragety'})
            break
        case TYPES.GET_TESTGROUP_SUCCESS:
            return Object.assign({}, state, {testgrouplist: action.testgrouplist})
            break
        case TYPES.DELETE_TEST_SUCCESS:
            return Object.assign({}, state, {testgrouplist: action.testgrouplist})
            break
        case TYPES.GET_STRAGETY_LIST:
            return Object.assign({}, state, {
                stragetylist: action.list,
                showtype: 'stragety',
                slbid: action.slbid,
                tgid: action.tgid
            })
            break
        case TYPES.ADD_STRAGETY:
            return Object.assign({}, state, {showtype: 'addstragety', editting_stragety: undefined})
            break
        case TYPES.ADD_URL_TYPE:
            return Object.assign({}, state, {addurltype: action.addurltype})
            break
        case TYPES.ADD_UID_TYPE:
            return Object.assign({}, state, {adduidtype: action.adduidtype})
            break
        case TYPES.ADD_URLS:
            return Object.assign({}, state, {addurls: state.addurls.concat(action.urls)})
            break
        case TYPES.DELETE_URL:
            state.addurls.splice(action.index, 1);
            return Object.assign({}, state, {addurls: state.addurls})
            break
        case TYPES.ADD_UIDS:
            return Object.assign({}, state, {adduids: state.adduids.concat(action.uids)})
            break
        case TYPES.DELETE_UID:
            state.adduids.splice(action.index, 1);
            return Object.assign({}, state, {adduids: state.adduids})
            break
        case TYPES.GET_CITIES_SUCCESS:
            return Object.assign({}, state, {cities: action.cities})
            break
        case TYPES.GET_SERVERS_SUCCESS:
            var tempservers = action.servers.map((server, index) => {
                var stragetiesinfo = server.stragetiesinfo;
                var status = false;//status为该机器的状态，是否有策略正在运行
                var statusinfo = '';
                stragetiesinfo.map((stragety) => {
                    if (stragety.stra_status === 'running') {
                        status = true;
                        statusinfo += stragety.stra_name + ' ';
                    }
                })
                return {
                    ip: server.ip,
                    key: server.key,
                    status: status,
                    statusinfo: statusinfo || ''
                }

            })
            return Object.assign({}, state, {servers: tempservers})
            break
        case TYPES.ADD_CITIES:
            return Object.assign({}, state, {citiesselected: action.citiesselected})
            break
        // case TYPES.VALIDATE_SUCCESS:
        //     return Object.assign({}, state, {validatestatus: 'success'})
        //     break
        case TYPES.SAVE_STRAGETY_RESULT:
            return Object.assign({}, state, {savestragetystatus: action.result})
            break
        case TYPES.ADD_SERVERS:
            return Object.assign({}, state, {serverselected: action.servers ,serverselectedkeys: action.serverkeys})
            break
        case TYPES.CHANGE_STRAGETY_STATUS:
            state.stragetylist.map((stra)=>{
                if(stra.stra_id === action.stra_id) stra.stra_status = action.status;
            })
            return Object.assign({}, state, {stragetylist: state.stragetylist})
            break
        case TYPES.EDIT_STRAGETY:
            var editting_stragety = undefined;
            state.stragetylist.map((stra)=>{
                if(stra.stra_id === action.stragety.stragetycode) editting_stragety = action.stragety
            })
            return  Object.assign({}, state, {editting_stragety: editting_stragety, showtype: 'addstragety'});
            break
        case TYPES.FRESH_STRAGETYLIST:
            return Object.assign({}, state, {stragetylist: action.stragetylist})
            break
        default:
            return state
    }
}

export default reducer