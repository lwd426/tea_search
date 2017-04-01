import { combineReducers } from 'redux'
import testgroup from './testgroup/reducer'
import datachart from './datachart/reducer'
import deviceinfo from './deviceinfo/reducer'
import serverlog from './serverlog/reducer'
import mainpage from './mainpage/reducer'

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
    testgroup,
    datachart,
    deviceinfo,
    serverlog,
    mainpage
})

export default rootReducer
