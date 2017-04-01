//处理数字增加的reducer
import * as TYPES from './constants'

let reducer = (state={showtype: 'testgroup', stragety: {}, testgrouplist: [], stragetylist: []},action)=>{
    switch(action.type){
        case TYPES.STRAGETY_LIST:
            return Object.assign({}, state, {stragety: action.stragety, showtype: 'stragety'})
            break
        case TYPES.GOBACK_TO_TESTINFOGROUP:
            return Object.assign({}, state, {showtype: 'testgroup'})
            break
        case TYPES.GET_TESTGROUP_SUCCESS:
            return Object.assign({}, state, {testgrouplist: action.testgrouplist})
            break
        case TYPES.DELETE_TEST_SUCCESS:
            return Object.assign({}, state, {testgrouplist: action.testgrouplist})
            break
        case TYPES.GET_STRAGETY_LIST:
            return Object.assign({}, state, {stragetylist: action.list})
            break
        default:
            return state
    }
}

export default reducer