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
    date_picker:[moment().subtract(5, 'days').format('YYYY/MM/DD'),moment().subtract(1, 'days').format('YYYY/MM/DD')],
    conversion_date_picker:[moment().subtract(5, 'days').format('YYYY/MM/DD'),moment().subtract(1, 'days').format('YYYY/MM/DD')],
    rangeDefaultVal: [moment().subtract(5, 'days'), moment().subtract(1, 'days')],
    menulist: [],
    testgrouplist: [],
    main_card_key: "1",
    strageties: '',
    options_two: [{
        value: '',
        label: ''
    }],
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
        case 'CONVERSIONDATEPICKER':{
            return Object.assign({},state, {
                conversion_date_picker: action.conversion_date_picker
            })
        }
        case TYPES.MAIN_CONTAINER_DISPLAY:{
            return Object.assign({}, state, {
                main_container_display: action.main_container_display,
                card_container_display: action.card_container_display,
                strageties: action.strageties,
                currentCasVal: action.currentCasVal,
                // main_card_key: "1",//写死，每次切换都回到流量tab
                main_card_key: action.main_display_key || state.main_card_key
            })
        }
        case TYPES.GET_MENUDATA_SUCCESS:{
            return Object.assign({}, state, {
                menulist: action.menulist
            })
        }
        case TYPES.GET_TESTGROUP_SUCCESS:{
            return Object.assign({}, state, {
                testgrouplist: action.testgrouplist
            })
        }
        case TYPES.MAIN_CARD_KEY:{
            return Object.assign({}, state, {
                main_card_key: action.main_card_key
            })
        }
        case TYPES.CASVAL:{
            return Object.assign({}, state, {
                casVal: action.casVal
            })
        }
        case TYPES.OPTIONS:{
            return Object.assign({}, state, {
                options_two: action.options_two
            })
        }
        default:
            return state
    }
}

export default reducer