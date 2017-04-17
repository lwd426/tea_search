import React, { Component, PropTypes } from 'react'
import { Layout, Breadcrumb} from 'antd';
import GLDeviceInfo from '../../components/deviceinfo';
import GLDataChart from '../../components/datachart';
import GLTestInfo from '../../components/testgroup';
import GLMainPage from '../../components/mainpage';
import * as actions from '../app/actions'
import * as menuactions from '../menu/actions'
import contentactions from '../../components/actions'

import '../app/app.css';
import './style.css';
import 'antd.min.css';
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
        let wintype = this.props.menu.wintype;
        return (
            <Content style={{ margin: '0 16px' }}>
                {/*<Breadcrumb style={{ margin: '12px 0' }}>*/}
                    {/*<Breadcrumb.Item>SLB域名1</Breadcrumb.Item>*/}
                    {/*<Breadcrumb.Item>Web服务器管理</Breadcrumb.Item>*/}
                {/*</Breadcrumb>*/}
                <div className="content-panel">
                    {(()=> {
                        switch(wintype){
                            case 'deviceinfo': return <GLDeviceInfo {...this.props}/>; break;
                            case 'testinfo': return <GLTestInfo {...this.props}/>; break;
                            case 'datachart': return <GLDataChart {...this.props}/>; break;
                            case 'stragetyinfo': return <GLStragetyInfo {...this.props}/>; break;
                            case 'mainpage': return <GLMainPage {...this.props}/>; break;
                        }
                    })()}
                </div>
            </Content>
        );
    }
}


//将state.counter绑定到props的counter
function mapStateToProps(state) {
    return{
            menu: state.menu,
            app: state.app,
            content: state.content
    }
}
//将action的所有方法绑定到props上
function mapDispatchToProps(dispatch) {
    // return  bindActionCreators(actions,dispatch)
return {
    appActions:bindActionCreators(actions,dispatch),
    menuActions:bindActionCreators(menuactions,dispatch),
    contentActions: contentactions(dispatch)
}
}

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(GLContent)
// export default GLContent;