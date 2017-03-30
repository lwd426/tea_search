import { bindActionCreators } from 'redux'

import * as testinfoActions from '../../components/testinfo/actions'
import * as deviceinfoActions from '../../components/deviceinfo/actions'
import * as serverlogActions from '../../components/serverlog/actions'
import * as datachartActions from '../../components/datachart/actions'

module.exports = function (dispatch){
    return {
        deviceinfoActions: bindActionCreators(deviceinfoActions,dispatch),
        testinfoActions: bindActionCreators(testinfoActions,dispatch),
        serverlogActions: bindActionCreators(serverlogActions,dispatch),
        datachartActions: bindActionCreators(datachartActions,dispatch),
    }
}
