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

        return true;
    }
    componentWillMount(){
        const slbid = this.props.menu.slbid || '';
        this.props.contentActions.deviceinfoActions.getWebServerList(slbid);
    }
    // onChange = (activeKey) => {
    //     if(activeKey == 2){
    //         const slbid = this.props.menu.slbid || '';
    //         this.props.contentActions.deviceinfoActions.getWebServerList(slbid);
    //     }
    // }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    render() {
        var _this = this;
        return (
        <GLWebservers {..._this.props}/>
        );
    }
}
export default GLDeviceInfo;