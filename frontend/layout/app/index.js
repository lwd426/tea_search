import React, { Component, PropTypes } from 'react'
import { Layout, Button, Modal} from 'antd';
import GLMenu from '../menu'
import GLContent from '../content'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from './actions'
import * as menuactions from '../menu/actions'
import contentactions from '../../components/actions'

import './app.css';
import 'antd.min.css';




const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    onCollapse = (collapsed) => {
        // let {reduxActions} = this.props;

        if(collapsed) {
            this.props.appActions.mini_menu()
        }else{
            this.props.appActions.max_menu()
        }
    }
    componentDidMount(){

    }
    addTestGroup=()=>{
        // let {menuActions} = this.props;
        this.props.menuActions.addTestGroup();
    }
    render() {
        return (
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }} />
                <Sider
                    collapsible
                    collapsed={this.props.app.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo" />
                    <GLMenu mode={this.props.app.mode}/>
                    <Button icon="plus" className="add-test-group-btn" onClick={()=>{
                        this.props.appActions.setAddSLBModalStatus(true)
                    }}>添加</Button>
                </Sider>
                <Layout>
                    <GLContent showtype="group" {...this.props}/>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2016 Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}


//将state.counter绑定到props的counter
function mapStateToProps(state) {
    return{
            app: state.app,
            menu: state.menu,
            content: state.content
    }
}
//将action的所有方法绑定到props上
function mapDispatchToProps(dispatch) {
    return  {
        appActions:bindActionCreators(actions,dispatch),
        menuActions:bindActionCreators(menuactions,dispatch),
        contentActions: contentactions(dispatch)
    }
}

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(App)