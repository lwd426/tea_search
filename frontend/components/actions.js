import { bindActionCreators } from 'redux'

import * as testgroupActions from './testgroup/actions'
import * as deviceinfoActions from './deviceinfo/actions'
import * as datachartActions from './datachart/actions'
import * as mainpageActions from './mainpage/actions'

module.exports = function (dispatch){
    return {
        deviceinfoActions: bindActionCreators(deviceinfoActions,dispatch),
        testgroupActions: bindActionCreators(testgroupActions,dispatch),
        datachartActions: bindActionCreators(datachartActions,dispatch),
        mainpageActions: bindActionCreators(mainpageActions,dispatch),
    }
}
