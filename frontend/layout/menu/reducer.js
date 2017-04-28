//处理数字增加的reducer
import * as TYPES from './constants'
import utilscomps from '../../components/utilscomps'

let reducer = (state={wintype: 'mainpage',slbid: '', editting_slb:undefined, add: false, domain: '', port: '80',domainId: '', menulist: []},action)=>{
    switch(action.type){
        case TYPES.CHANGE_SLB_SUCCESS:
            var showtype = action.wintype;
            if(action.wintype  === 'stragetyinfo') showtype = 'testinfo'
            if(!action.slbid){
                return Object.assign({}, state, { wintype: action.wintype, selectedSubMenu: state.slbid + ',' + showtype})
            }else if(!action.wintype) {
                return Object.assign({}, state, {slbid: action.slbid,openSlb: action.slbid, domain: action.domain, domainId: action.domainId})
            }else{
                return Object.assign({}, state, { wintype: action.wintype, slbid: action.slbid, selectedSubMenu: action.slbid + ',' + showtype, openSlb: action.slbid, domain: action.domain, domainId: action.domainId})
            }
            break
        case TYPES.CHANGE_OPEN_SLBS:
            return Object.assign({}, state, { openSlb: action.slbs})
            break
        case TYPES.ADD_TEST_GROUP:
            return Object.assign({}, state, { add: true})
            break
        case TYPES.CANCEL_ADD_TEST_GROUP:
            return Object.assign({}, state, { add: false})
            break
        case TYPES.SAVE_MENU_SUCCESS:
            return Object.assign({}, state, { menulist: action.menulist, add: false})
            break
        case TYPES.GET_MENUDATA_SUCCESS:
            return Object.assign({}, state, { menulist: action.menulist, add: false, editting_slb: undefined})
            break
        case TYPES.DELETE_MENU_SUCCESS:
            utilscomps.showNotification('success', '成功', '删除slb信息成功！', 1);
            return Object.assign({}, state, { menulist: action.menulist, add: false, editting_slb: undefined})
            break
        case TYPES.EDIT_SLB_CLICK:
            return Object.assign({}, state, { editting_slb: {
                slbid: action.slbid,
                slbname: action.slbname
            }})
            break
        case TYPES.EDIT_MENUDATA_SUCCESS:
            utilscomps.showNotification('success', '成功', '修改slb信息成功！', 1);
            return Object.assign({}, state, { menulist: action.menulist, add: false, editting_slb: undefined})
            break
        default:
            return state
    }
}

export default reducer