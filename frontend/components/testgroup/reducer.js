//处理数字增加的reducer
import * as TYPES from './constants'

let reducer = (state={showtype: 'testgroup', slbid:'', tgid: '',addurls:[], cities:[], adduids: [],serverlist:[], addurltype: 'multiple',adduidtype: 'multiple',stragety: {}, testgrouplist: [], stragetylist: []},action)=>{
    switch(action.type){
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
            return Object.assign({}, state, {stragetylist: action.list,showtype: 'stragety', slbid: action.slbid, tgid: action.tgid})
            break
        case TYPES.ADD_STRAGETY:
            return Object.assign({}, state, {showtype: 'addstragety'})
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
            // var cities = action.cities.map((city, index)=>{
            //     return {
            //         value: city.name4en,
            //         label: city.name,
            //         code: city.admincode
            //     }
            // })
            return Object.assign({}, state, {cities: action.cities})
            break
        default:
            return state
    }
}

export default reducer