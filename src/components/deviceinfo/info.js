import React, { Component, PropTypes } from 'react'
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

class GLTree extends React.Component {
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }
    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    }
    render() {
        return (
            <div className="stragety-div">
                <div>
                    <div>URL</div>
                    <span>192.168.1.1</span>
                    <span>192.168.1.1</span>
                    <span>192.168.1.1</span>
                    <span>192.168.1.1</span>
                    <span>192.168.1.1</span>
                    <span>192.168.1.1</span>
                </div>
                <div>
                    <div>UID</div>
                    <span>111111111</span>
                    <span>111111111</span>
                    <span>111111111</span>
                    <span>111111111</span>
                    <span>111111111</span>
                </div>

            </div>
        );
    }
}

export default GLTree;