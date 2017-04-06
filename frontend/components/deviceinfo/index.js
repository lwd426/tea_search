import React, { Component, PropTypes } from 'react'
import { Tabs } from 'antd';
import GLDomain from './components/domainname'
import GLWebservers from './components/webservers'
const TabPane = Tabs.TabPane;


class GLDeviceInfo extends React.Component {
    constructor(props) {
        super(props);
        var _this = this;
        // this.state = {
        //     activeKey: panes[0].key,
        //     panes,
        // };
    }
    componentWillReceiveProps(nextProps) {
                console.log('device componentWillReceiveProps')

        return true;
    }
    onChange = (activeKey) => {
        console.log('changetab')
        if(activeKey == 2){
            const slbid = this.props.menu.slbid || '';
            this.props.contentActions.deviceinfoActions.getWebServerList(slbid);
        }
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    render() {
        console.log('device render')
        var _this = this;
        return (
            <Tabs
                onChange={this.onChange}
                onEdit={this.onEdit}
                {...this.props}
            >
                <TabPane tab="域名信息维护"  key="1" closable="false" {..._this.props}><GLDomain {..._this.props}/></TabPane>
                <TabPane tab="Web服务器维护"  key="2" closable="false" {..._this.props}> <GLWebservers {..._this.props}/></TabPane>
            </Tabs>
        );
    }
}
export default GLDeviceInfo;