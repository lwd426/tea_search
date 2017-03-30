import React, { Component, PropTypes } from 'react'
import { Tabs } from 'antd';
import GLDomain from './components/domainname'
import GLWebservers from './components/webservers'
const TabPane = Tabs.TabPane;


class GLDeviceInfo extends React.Component {
    constructor(props) {
        super(props);
        const panes = [
            { title: '域名信息维护', content: <GLDomain/>, key: '1', closable: false },
            { title: 'Web服务器维护', content: <GLWebservers/>, key: '2', closable: false  },
        ];
        this.state = {
            activeKey: panes[0].key,
            panes,
        };
    }

    onChange = (activeKey) => {
        this.setState({ activeKey });
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    render() {
        return (
            <Tabs
                onChange={this.onChange}
                activeKey={this.state.activeKey}
                type="editable-card"
                onEdit={this.onEdit}
            >
                {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}
            </Tabs>
        );
    }
}
export default GLDeviceInfo;