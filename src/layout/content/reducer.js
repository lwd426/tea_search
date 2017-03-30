import { combineReducers } from 'redux'
import testinfo from '../../components/testinfo/reducer'
import datachart from '../../components/datachart/reducer'
import deviceinfo from '../../components/deviceinfo/reducer'
import serverlog from '../../components/serverlog/reducer'

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
    testinfo,
    datachart,
    deviceinfo,
    serverlog
})

export default rootReducer
