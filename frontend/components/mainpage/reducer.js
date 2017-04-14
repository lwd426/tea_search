//处理数字增加的reducer
import * as TYPES from './constants';
import moment from 'moment';

let initState = {
    main_container_display: 'block',
    card_container_display: 'none',
    content_one_display: 'block',
    content_two_display: 'none',
    content_two_key: 1,
    stragety: [],
    date_picker:[moment().subtract(7, 'days').format('YYYY/MM/DD'),moment().format('YYYY/MM/DD')],
    menulist: [],
    testgrouplist: [],
}

let reducer = (state = initState,action)=>{
    switch(action.type){
        case TYPES.EDIT_STRAGETY_INFO:
            return Object.assign({}, state, {stragety: action.stragety, xxx: 'stragety'})
            break
        case TYPES.CONTENT_DISPLAY:
            return Object.assign({}, state, {
                content_one_display: action.content_one_display, 
                content_two_display: action.content_two_display,
                content_two_key: action.content_two_key ? action.content_two_key : state.content_two_key,
            })
        case TYPES.PROJECT_VALUE:
            return Object.assign({}, state, {
                stragety: action.stragety
            })
        case TYPES.DATE_PICKER:{
            return Object.assign({}, state, {
                date_picker: action.date_picker
            })
        }
        case TYPES.MAIN_CONTAINER_DISPLAY:{
            return Object.assign({}, state, {
                main_container_display: action.main_container_display,
                card_container_display: action.card_container_display,
            })
        }
        case TYPES.GET_MENUDATA_SUCCESS:{
            return Object.assign({}, state, {
                menulist: action.menulist
            })
        }case TYPES.GET_TESTGROUP_SUCCESS:{
            return Object.assign({}, state, {
                testgrouplist: action.testgrouplist
            })
        }
        default:
            return state
    }
}

export default reducer