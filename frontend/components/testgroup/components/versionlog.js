import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
// import GLInfo from '../../deviceinfo/components/info'
import utilscomps from '../../utilscomps'

import { Table, Input, Icon,Popover, Button, Popconfirm } from 'antd';
const uuid = require('uuid/v1');
const columns = [{
    title: '版本号',
    dataIndex: 'versioncode',
}, {
    title: '版本简述',
    dataIndex: 'versiondesc',
}, {
    title: '发布时间',
    dataIndex: 'versiondate',
},
    {
        title: '详情',
        dataIndex: 'details',
    },{
        title: '操作',
        dataIndex: 'operation',
    }];

class GLPop extends React.Component{
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps =(nextProps)=> {
        return true;
    }
    render() {
        return (
            <div>
                {this.props.data.map((data)=>{
                    return (<div><div>{data.stra_name}</div><div>{data.stra_status}</div><div>{data.stra_urls}</div><div>{data.stra_uids}</div><div>{data.stra_regions}</div></div>)

                })}
            </div>
        )
    }
}

class GLVersionlog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }
    componentWillReceiveProps =(nextProps)=> {
        return true;
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    }
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }
    componentWillMount=()=>{
    }
    goBack = () => {
        this.props.contentActions.testgroupActions.goback()
    }
    render() {
        const data = [{
            versionkey: '222233dfd-ddfdfdfsdsd-dfdfdfdfd',
            versioncode: '1.1.1',
            versiondesc: '增加版本button',
            versiondate: '2017-04-13 12:00:00',
            info: [{
                stra_name: '策略1',
                stra_urls: ['m.le.com','http://m.xx.com/play.html'],
                stra_uids: ['11111', '222222'],
                stra_regions: ['北京','天津'],
                stra_servers: ['129.333.222.444'],
                stra_status: 'running'
            },{
                stra_name: '策略1',
                stra_urls: ['m.le.com','http://m.xx.com/play.html'],
                stra_uids: ['11111', '222222'],
                stra_regions: ['北京','天津'],
                stra_servers: ['129.333.222.444'],
                stra_status: 'stopped'
            }]
        }]
        return (
            <div>
                <div className="gl-testinfo-btndiv">
                    <Button className="gl-left-btn" icon="double-left" onClick={this.goBack}>返回</Button>
                </div>
                <Table columns={columns} dataSource={data.map((version, index)=>{
                    return {
                        key: index + 1,
                        versionkey: version.versionkey,
                        versioncode: version.versioncode,
                        versiondesc: version.versiondesc,
                        versiondate: version.versiondate,
                        details: <Popover
                            content={<div><GLPop data={version.info}/><a onClick={this.hide}>Close</a></div>}
                            title="Title"
                            trigger="click"
                            visible={this.state.visible}
                            onVisibleChange={this.handleVisibleChange}
                             >
                            <Button icon="book">版本详情</Button>
                        </Popover>,
                        operation: <Button>回滚</Button>


                    }
                })} size="middle" />
            </div>
        );
    }
}


export default GLVersionlog;
