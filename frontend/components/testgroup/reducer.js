//处理数字增加的reducer
import utilscomps from '../utilscomps'
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
    ,editting_status: false //正在编辑的策略
    ,refer_stragety: undefined //正在编辑的策略
    ,versionModalShow: false//发布版本弹出框状态
    ,versionloglist: [] //版本列表
    , validateStra: {
        name: {
            status: false,
            info: '请输入分流策略名称'
        },
        server: {
            status: false,
            info: '请选择分流服务器'
        },
        url: {
            status: false,
            info: '规则：请填写相对路径（不能包含域名）；支持正则表达式；如：/ 或 /index.html 或 ^~ /index.html 或 ~* /index.html'
        },
        uid: {
            status: false,
            info: ''
        },
        region: {
            status: false,
            info: ''
        }
    }
}

let reducer = (state = initialState, action)=> {
    switch (action.type) {
        case TYPES.STRAGETY_LIST:
            return Object.assign({}, state, {stragety: action.stragety, showtype: 'stragety'})
            break
        case TYPES.GET_VERSIONLOG_SUCCESS:
            return Object.assign({}, state, {versionloglist: action.list, showtype: 'versionlog'})
            break
        case TYPES.GOBACK_TO_TESTINFOGROUP:
            return Object.assign({}, state, {showtype: 'testgroup'})
            break
        case TYPES.GOBACK_TO_STRAGETYLIST:
            return Object.assign({}, state, {showtype: 'stragety', editting_stragety: undefined, editting_status: false})
            break
        case TYPES.GET_TESTGROUP_SUCCESS:
            return Object.assign({}, state, {testgrouplist: action.testgrouplist})
            break
        case TYPES.DELETE_TEST_SUCCESS:
            return Object.assign({}, state, {testgrouplist: action.testgrouplist})
            break
        case TYPES.GET_STRAGETY_LIST:
            var refer_s = undefined;
            action.list.map((stragety)=>{
                if(stragety.type === 'refer') refer_s = stragety;
            })
            return Object.assign({}, state, {
                stragetylist: action.list,
                refer_stragety: refer_s,
                showtype: 'stragety',
                slbid: action.slbid,
                tgid: action.tgid,
                editting_stragety: undefined,
                editting_status: false
            })
            break
        case TYPES.ADD_STRAGETY:
            var initStatus = {
                name: {
                    status: false,
                    info: '请输入分流策略名称'
                },
                server: {
                    status: false,
                    info: '请选择分流服务器'
                },
                url: {
                    status: false,
                    info: ''
                },
                uid: {
                    status: false,
                    info: ''
                },
                region: {
                    status: false,
                    info: ''
                }
            }
            return Object.assign({}, state, {showtype: 'addstragety', validateStra: initStatus,  editting_stragety: undefined, editting_status: false, serverselectedkeys:[],addurls: [], adduids: []})
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
                var stragetiesinfo = server.strageties;
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
                    refer: server.refer,
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
            var status = action.status  === 'running' ? '运行' : '停止';
            utilscomps.showNotification('warning', '操作成功', '策略已经' + status + ', 必须点击"发布到服务器"按钮，此次操作才能生效' );
            return Object.assign({}, state, {stragetylist: state.stragetylist})
            break
        case TYPES.EDIT_STRAGETY:
            var stra = action.stragety;
            var urls= stra.urlsvalues;
            var uids = stra.uidsvalues;
            if(urls[0] === '') urls = [];
            if(uids[0] === '') uids = [];
            return Object.assign({}, state, {
                showtype: 'addstragety',
                editting_stragety: stra,
                editting_status: stra.code,
                addurls: urls,
                adduids: uids,
                serverselectedkeys: stra.serverskey
                });

            break
        case TYPES.FRESH_STRAGETYLIST:
            utilscomps.showNotification('success', '生成标签成功', '请通知相关开发人员，进行标签修改或添加！');
            return Object.assign({}, state, {stragetylist: action.stragetylist})
            break
        case TYPES.VALIDATE_FAILURE:
            var key = action.key,
                info = action.info,
                validateStra = state.validateStra;
            if(key === 'url,uid'){
                validateStra.url.status = 'error';validateStra.url.info = info;
                validateStra.uid.status = 'error';validateStra.uid.info = info;
                validateStra.name.status = 'success';validateStra.name.info = '';
            }else{
                switch(key){
                    case "name": validateStra.name.status = 'error';validateStra.name.info = info;break;
                    case "server": validateStra.server.status = 'error';validateStra.server.info = info;validateStra.name.status = 'success';validateStra.name.info = '';break;
                    case "url": validateStra.url.status = 'error';validateStra.url.info = info;validateStra.name.status = 'success';validateStra.name.info = '';break;
                    case "uid": validateStra.uid.status = 'error';validateStra.uid.info = info;validateStra.name.status = 'success';validateStra.name.info = '';break;
                    case "region": validateStra.region.status = 'error';validateStra.region.info = info;validateStra.name.status = 'success';validateStra.name.info = '';break;
                }
            }

            return Object.assign({}, state, {validateStra: validateStra})
            break
        case TYPES.PUBLISH_SUCCESS:
            if(action.status) {
                utilscomps.showNotification('success', '发布成功', '发布成功！发版日志请版本日志页');
                return Object.assign({}, state, {versionModalShow: false})
            }else{
                utilscomps.showNotification('error', '发布失败', '失败原因：' + action.data );
                return state;
            }

            break
        case TYPES.PUBLISH_MODAL:
            return Object.assign({}, state, {versionModalShow: action.status})
            break
        default:
            return state
    }
}

export default reducer