import React, { Component, PropTypes } from 'react'
import { Tabs } from 'antd';
import GLDomain from './components/domainname'
import GLWebservers from './components/webservers'
const TabPane = Tabs.TabPane;


class GLDeviceInfo extends React.Component {
    constructor(props) {
        super(props);
        var _this = this
        const panes = [
            { title: '域名信息维护', content: <GLDomain {..._this.props}/>, key: '1', closable: false },
            { title: 'Web服务器维护', content: <GLWebservers {..._this.props}/>, key: '2', closable: false  },
        ];
        this.state = {
            activeKey: panes[0].key,
            panes,
        };
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
                type="editable-card"
                onEdit={this.onEdit}
                {...this.props}
            >
                {this.state.panes.map((pane) => <TabPane tab={pane.title}  key={pane.key} closable={pane.closable} {..._this.props}>{pane.content}</TabPane>)}
            </Tabs>
        );
    }
}
export default GLDeviceInfo;