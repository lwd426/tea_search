import { TreeSelect } from 'antd';
import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

var treeData = [];
class GLServerTree extends React.Component {
    onChange = (values, labels) => {
        var la = labels.map((label)=>{
            if(label.indexOf('(')!==-1){
                return label.substring(0, label.indexOf('('))
            }else{
                return label;
            }
        })
        this.props.contentActions.testgroupActions.addServers(values, la);
    }
    componentWillReceiveProps =(nextProps)=> {
        return true;
    }
    componentDidMount =()=>{

    }
    render() {
        treeData = this.props.content.testgroup.servers.map((server, index) => {
            return {
                label: server.status ?  server.ip + '(' +server.statusinfo +')' : server.ip ,
                value: server.key,
                key: server.key,
                disabled: server.refer
            }
        })
        const tProps = {
            treeData,
            value: this.props.content.testgroup.serverselectedkeys,
            onChange: this.onChange,
            multiple: true,
            allowClear: true,
            defaultValue:  [],
            placeholder: '请选择策略的分流服务器',
            size: 'large',
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: 'Please select'
        };
        return <TreeSelect {...tProps} />;
    }
}


export default GLServerTree;