import { TreeSelect } from 'antd';
import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const treeData = [{
    label: '192.168.1.1',
    value: '1',
    key: '1wewer',
}, {
    label: '192.168.1.2',
    value: '2',
    key: '2ddd',
}, {
    label: '192.168.1.3',
    value: '3',
    key: 'dfdfd',
}, {
    label: '192.168.1.4',
    value: '4',
    key: '4ddfdfddf',
}, {
    label: '192.168.1.5',
    value: '5',
    key: '5dfdfdf',
}, {
    label: '192.168.1.6',
    value: '6',
    key: '6',
}];

class GLServerTree extends React.Component {
    state = {
        value: ['1','2'],
    }
    onChange = (values, labels) => {
        console.log('onChange ', value, arguments);
        this.setState({ value });

    }
    render() {
        const tProps = {
            treeData,
            value: this.state.value,
            onChange: this.onChange,
            multiple: true,
            defaultValue:  ['1','2'],
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: 'Please select'
        };
        return <TreeSelect {...tProps} />;
    }
}


export default GLServerTree;