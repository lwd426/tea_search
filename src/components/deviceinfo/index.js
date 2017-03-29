import React, { Component, PropTypes } from 'react'
import { Tabs } from 'antd';
import GLDomain from './domainname'
import GLWebservers from './webservers'
import GLServerGroup from './servergroup'
const TabPane = Tabs.TabPane;


class GLDeviceInfo extends React.Component {
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
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
    add = () => {
        const panes = this.state.panes;
        const activeKey = 'newTab${this.newTabIndex++}';
        panes.push({ title: '服务器分组', content: <GLServerGroup/>, key: activeKey });
        this.setState({ panes, activeKey });
    }
    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({ panes, activeKey });
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