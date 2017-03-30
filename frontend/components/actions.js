import { bindActionCreators } from 'redux'

import * as testinfoActions from './testinfo/actions'
import * as deviceinfoActions from './deviceinfo/actions'
import * as serverlogActions from './serverlog/actions'
import * as datachartActions from './datachart/actions'

module.exports = function (dispatch){
    return {
        deviceinfoActions: bindActionCreators(deviceinfoActions,dispatch),
        testinfoActions: bindActionCreators(testinfoActions,dispatch),
        serverlogActions: bindActionCreators(serverlogActions,dispatch),
        datachartActions: bindActionCreators(datachartActions,dispatch),
    }
}
