import React, { Component, PropTypes } from 'react'
import { Layout, Breadcrumb} from 'antd';
import GLServerLog from '../serverlog';
import GLDeviceInfo from '../deviceinfo';
import GLDataChart from '../datachart';
import GLTestInfo from '../testinfo';
import '../app/app.css';
import './style.css';
import 'antd.min.css';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../menu/actions'

const {  Content} = Layout;

class GLContent extends React.Component {
    constructor(props) {
        super(props);

    }
    componentWillReceiveProps(nextProps) {
        return true;
    }
    render() {
        let {reduxState} = this.props;
        let wintype = reduxState.menu.wintype;
        return (
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item>SLB域名1</Breadcrumb.Item>
                    <Breadcrumb.Item>Web服务器管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-panel">
                    {(()=> {
                        switch(wintype){
                            case 'deviceinfo': return <GLDeviceInfo/>; break;
                            case 'serverlog': return <GLServerLog/>; break;
                            case 'testinfo': return <GLTestInfo/>; break;
                            case 'datachart': return <GLDataChart/>; break;
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
        reduxState:{
            menu: state.menu
        }
    }
}
//将action的所有方法绑定到props上
function mapDispatchToProps(dispatch) {
    return  {
        reduxActions:bindActionCreators(actions,dispatch)
    }
}

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(GLContent)