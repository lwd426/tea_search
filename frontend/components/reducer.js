import { combineReducers } from 'redux'
import testinfo from './testinfo/reducer'
import datachart from './datachart/reducer'
import deviceinfo from './deviceinfo/reducer'
import serverlog from './serverlog/reducer'

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
    testinfo,
    datachart,
    deviceinfo,
    serverlog
})

export default rootReducer
