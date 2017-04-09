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
                    <div>服务器</div>
                    { this.props.servers.map((cell)=>{
                        return (<span>{cell}</span>)
                    })
                    }
                </div>
                <div>
                    <div>URL</div>
                    { this.props.urls.map((cell)=>{
                        return (<span>{cell}</span>)
                      })
                    }
                </div>
                <div>
                    <div>UID</div>
                    { this.props.uids.map((cell)=>{
                        return (<span>{cell}</span>)
                    })
                    }
                </div>

            </div>
        );
    }
}

export default GLTree;