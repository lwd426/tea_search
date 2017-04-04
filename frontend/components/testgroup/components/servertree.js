import { TreeSelect } from 'antd';
import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const treeData = [{
    label: '192.168.1.1',
    value: '1',
    key: '1',
}, {
    label: '192.168.1.2',
    value: '2',
    key: '2',
}, {
    label: '192.168.1.3',
    value: '3',
    key: '3',
}, {
    label: '192.168.1.4',
    value: '4',
    key: '4',
}, {
    label: '192.168.1.5',
    value: '5',
    key: '5',
}, {
    label: '192.168.1.6',
    value: '6',
    key: '6',
}];

class GLServerTree extends React.Component {
    state = {
        value: ['1','2'],
    }
    onChange = (value) => {
        console.log('onChange ', value, arguments);
        this.setState({ value });
    }
    render() {
        const tProps = {
            treeData,
            value: this.state.value,
            onChange: this.onChange,
            multiple: true,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: 'Please select',
            style: {
                width: 300,
            },
        };
        return <TreeSelect {...tProps} />;
    }
}


export default GLServerTree;