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
            <Tree
                checkable
                defaultExpandedKeys={['0-0-0', '0-0-1']}
                defaultSelectedKeys={['0-0-0', '0-0-1']}
                defaultCheckedKeys={['0-0-0', '0-0-1']}
                onSelect={this.onSelect}
                onCheck={this.onCheck}
            >
                    <TreeNode title={<span style={{ color: '#08c' }}>192.168.1.1</span>} key="0-0-1-0" />
                    <TreeNode title={<span style={{ color: '#08c' }}>192.168.1.1</span>} key="0-0-1-1" />
                    <TreeNode title={<span style={{ color: '#08c' }}>192.168.1.1</span>} key="0-0-1-2" />
                    <TreeNode title={<span style={{ color: '#08c' }}>192.168.1.1</span>} key="0-0-1-3" />
            </Tree>
        );
    }
}

export default GLTree;