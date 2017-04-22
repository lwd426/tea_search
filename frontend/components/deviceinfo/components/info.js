import React, { Component, PropTypes } from 'react'
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

class GLTree extends React.Component {
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
                <div>
                    <div>区域</div>
                    { this.props.cities.map((cell)=>{
                        return (<span>{cell.split(';')[1]}</span>)
                    })
                    }
                </div>

            </div>
        );
    }
}

export default GLTree;