import React, { Component, PropTypes } from 'react'
import GLDeviceInfo from '../../components/deviceinfo';
import GLDataChart from '../../components/datachart';
import GLTestInfo from '../../components/testgroup';
import GLMainPage from '../../components/mainpage';
import { Button, Modal ,Layout, Breadcrumb} from 'antd';

import '../app/app.css';
import './style.css';
import 'antd.min.css';
import GLAddSlb from './addSlbModal'
import GLAddTg from './addTgModal'
import GLAddServer from './addServerModal'
import * as actions from '../app/actions'
import * as menuactions from '../menu/actions'
import * as contActions from './actions'
import contentactions from '../../components/actions'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const {  Content} = Layout;

class GLContent extends React.Component {
    constructor(props) {
        super(props);

    }
    componentWillReceiveProps(nextProps) {
        return true;
    }
    render() {
        let {domain,domainId, wintype } = this.props.menu;
        // let
        // switch(wintype){
        //     case 'deviceinfo':
        // }
        return (
            <div className="gl-content">
                { wintype !== 'mainpage' ? (
                    <Breadcrumb style={{ margin: '12px 0' }} separator=">">
                    <Breadcrumb.Item>{domain + (domainId ? '('+domainId + ')' : '')}</Breadcrumb.Item>
                    <Breadcrumb.Item>{wintype === 'deviceinfo' ? '设备管理' : '测试项目'}</Breadcrumb.Item>
                    </Breadcrumb>)
                     : ''
                }

                <div className="content-panel">
                    {(()=> {
                        switch(wintype){
                            case 'deviceinfo': return <GLDeviceInfo {...this.props}/>; break;
                            case 'testinfo': return <GLTestInfo {...this.props}/>; break;
                            case 'stragetyinfo': return <GLStragetyInfo {...this.props}/>; break;
                            case 'mainpage': return <GLMainPage {...this.props}/>; break;
                        }
                    })()}
                </div>
                <Modal title="新建测试组" closable={false} footer={null} visible={this.props.cont.showSlbModal}
                >
                    <GLAddSlb {...this.props} />
                </Modal>
                <Modal title="新建测试项目"  closable={false} footer={null} visible={this.props.cont.showTgModal}
                >
                    <GLAddTg {...this.props} />
                </Modal>
                <Modal title="新建服务器"  footer={null} closable={false} visible={this.props.cont.showServerModal}
                >
                    <GLAddServer {...this.props} />
                </Modal>
                {/*<Button className="gl-addslb-btn" icon="add" onClick={()=>{*/}
                    {/*this.props.contActions.setAddSLBModalStatus(true)*/}
                {/*}}>新增测试项</Button>*/}
            </div>
        );
    }
}


//将state.counter绑定到props的counter
function mapStateToProps(state) {
    return{
            menu: state.menu,
            app: state.app,
            content: state.content,
            cont: state.cont
    }
}
//将action的所有方法绑定到props上
function mapDispatchToProps(dispatch) {
    // return  bindActionCreators(actions,dispatch)
return {
    appActions:bindActionCreators(actions,dispatch),
    menuActions:bindActionCreators(menuactions,dispatch),
    contentActions: contentactions(dispatch),
    contActions: bindActionCreators(contActions,dispatch)
}
}

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(GLContent)
// export default GLContent;