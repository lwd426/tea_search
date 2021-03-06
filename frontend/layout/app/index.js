import React, { Component, PropTypes } from 'react'
import { Layout, Button,Icon, Modal,Popover} from 'antd';
import GLMenu from '../menu'
import GLContent from '../content'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from './actions'
import * as menuactions from '../menu/actions'
import * as contActions from './actions'
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
        var toolbarType = 'stragetyinfo hidden'
        if(this.props.menu.wintype === 'stragetyinfo' ){
            toolbarType = 'stragetyinfo'
        }else if(this.props.menu.wintype !== 'mainpage'){
            toolbarType = 'mainpage'
        }
        return (
            <Layout>
                <div className="app-container" >
                    <Header>
                        乐视视频灰度发布系统
                        <Button icon="home" className="gl-gohome" onClick={()=>{
                            this.props.menuActions.changeShowWinType(0, 'mainpage');
                            this.props.content.mainpage.card_container_display = 'none';
                            this.props.content.mainpage.content_one_display = 'block'
                            this.props.content.mainpage.main_container_display = 'block'
                            this.props.content.mainpage.content_two_display = 'none';
                            this.props.content.mainpage.currentCasVal = undefined;
                            {/*this.props.app.collapsed = true;*/}
                        }}>返回首页</Button>
                    </Header>
                    <Content>
                        {/*<div className="quickBox">*/}
                            {/*<div className={toolbarType === 'stragetyinfo' ? (this.props.app.collapsed ? "backcenter" : "backcenter close" ) : "backcenter hidden"}>*/}
                                {/*<Button icon="home" className="gl-half-l-btn" onClick={()=>{*/}
                                    {/*this.props.menuActions.changeShowWinType(0, 'mainpage');*/}
                                    {/*this.props.content.mainpage.card_container_display = 'none';*/}
                                    {/*this.props.content.mainpage.content_one_display = 'block'*/}
                                    {/*this.props.content.mainpage.main_container_display = 'block'*/}
                                    {/*this.props.content.mainpage.content_two_display = 'none';*/}
                                    {/*this.props.content.mainpage.currentCasVal = undefined;*/}
                                    {/*this.props.app.collapsed = true;*/}
                                {/*}}>返回home</Button>*/}
                                {/*<Button className="gl-half-r-btn" onClick={()=>{*/}
                                    {/*let {slbid, tgid, stragetylist} = this.props.content.testgroup;*/}
                                    {/*let tags = [];*/}
                                    {/*stragetylist.map((stra)=>{*/}
                                        {/*if(stra.tag) tags.push(stra.tag);*/}
                                    {/*})*/}
                                    {/*let currentCasVal = [slbid, tgid];*/}
                                    {/*this.props.menu.wintype = 'mainpage';*/}
                                    {/*this.props.app.collapsed = true;*/}
                                    {/*this.props.contentActions.mainpageActions.switchContentShow('none','block','["'+tags.join('","')+'"]',currentCasVal)*/}

                                {/*}}>指标分析<Icon type="bar-chart" /></Button>*/}
                            {/*</div>*/}
                            {/*<div className={toolbarType === 'mainpage' ? (this.props.app.collapsed ? "backcenter" : "backcenter close" ) : "backcenter hidden"}>*/}
                                {/*<Button icon="home" className="gl-main-back-btn" onClick={()=>{*/}
                                    {/*this.props.menuActions.changeShowWinType(0, 'mainpage');*/}
                                    {/*this.props.content.mainpage.card_container_display = 'none';*/}
                                    {/*this.props.content.mainpage.content_one_display = 'block'*/}
                                    {/*this.props.content.mainpage.main_container_display = 'block'*/}
                                    {/*this.props.content.mainpage.content_two_display = 'none';*/}
                                    {/*this.props.content.mainpage.currentCasVal = undefined;*/}
                                    {/*this.props.app.collapsed = true;*/}
                                {/*}}>返回home</Button>*/}
                            {/*</div>*/}
                        {/*</div>*/}

                        <Sider
                                collapsible
                                collapsed={this.props.app.collapsed}
                                onCollapse={this.onCollapse}
                            >
                            <div className="logo" >测试组列表</div>
                            <GLMenu mode={this.props.app.mode}/>
                            <Button icon="plus" className="add-test-group-btn" onClick={()=>{
                                console.log(this.props)
                                this.props.cont.domainId = ''
                                this.props.appActions.setAddSLBModalStatus(true)
                            }}>添加</Button>
                        </Sider>
                        <Layout className="gl-right-layout">
                            <GLContent showtype="group" {...this.props}/>
                        </Layout>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        le.com ©2017 Created by le.com
                    </Footer>
                </div>
            </Layout>
        );
    }
}


//将state.counter绑定到props的counter
function mapStateToProps(state) {
    return{
            app: state.app,
            menu: state.menu,
            content: state.content,
            cont: state.cont
    }
}
//将action的所有方法绑定到props上
function mapDispatchToProps(dispatch) {
    return  {
        appActions:bindActionCreators(actions,dispatch),
        menuActions:bindActionCreators(menuactions,dispatch),
        contentActions: contentactions(dispatch),
        contActions: bindActionCreators(contActions,dispatch)

    }
}

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(App)