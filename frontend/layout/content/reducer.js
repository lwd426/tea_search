//处理数字增加的reducer
import * as TYPES from './constants'
import utilscomps from '../../components/utilscomps'
const initalState = {
    showSlbModal: false
    ,showTgModal: false
    ,showServerModal: false
    ,domainId : ''
    , validateDomain: {
        name: {
            data: '',
            status: '',
            info: '请输入名称'
        },
        domain: {
            data: '',
            status: '',
            info: '我们需要验证您填写的域名ID是否正确'
        }
    }
}

let reducer = (state = initalState,action)=>{
    switch(action.type){
        case TYPES.SHOW_ADD_SLB_MODAL:
            if(!action.status){
                return Object.assign({}, state, { showSlbModal: action.status})
            }else{
                return Object.assign({}, state, { showSlbModal: action.status, validateDomain: {
                    name: {
                        data: '',
                        status: '',
                        info: '请输入名称'
                    },
                    domain: {
                        data: '',
                        status: '',
                        info: '我们需要验证您填写的域名ID是否正确'
                    }
                }})
            }
            break
        case TYPES.SHOW_ADD_SERVER_MODAL:
            return Object.assign({}, state, { showServerModal: action.status})
            break
        case TYPES.SHOW_ADD_TG_MODAL:
            return Object.assign({}, state, { showTgModal: action.status})
            break
        case TYPES.VALIDATE_DOMAIN_RESULT:
            console.log('dd')
            var key = action.key,
                info = action.info,
                status = action.status,
                validateDomain = state.validateDomain,
                name = action.name || '',
                domain = action.domain || '',
                domainId = action.domainId || '';
                switch(key){
                    case "name": validateDomain.name.status = status;
                        validateDomain.name.info = info;break;
                        validateDomain.name.info = info;break;
                        validateDomain.name.data = name;break;
                    case "domain":
                        validateDomain.domain.status = status;
                        validateDomain.domain.info = info;
                        validateDomain.domain.data = domain;
                        break;
                }
                if(action.status === 'success'){
                    return Object.assign({}, state, {validateDomain: validateDomain, domainId: action.data.domainId})
                }else{
                    return Object.assign({}, state, {validateDomain: validateDomain})
                }
            break
        default:
            return state
    }
}

export default reducer