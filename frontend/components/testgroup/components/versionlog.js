import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';

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
                    return (<div>
                        <div>策略名称：{data.name}</div>
                        <div>状态：{data.status}</div>
                        <div>urls：{data.urlArray.length === 0 ? '无' : data.urlArray.join(' ')}</div>
                        <div>uids：{data.uidArray.length === 0 ? '无' : data.uidArray.join(' ')}</div>
                        <div>区域：{data.regionArray.length === 0 ? '无' : data.regionArray.join(' ')}</div>
                        <div>服务器：{data.serverArray.length === 0 ? '无' : data.serverArray.join(' ')}</div>
                        <div className="gl-line-div"><span className="gl-line"></span><span className="gl-line"></span></div>
                    </div>)

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
        let _this = this;
        console.log('dd')
        const {versionloglist} = this.props.content.testgroup;
        // let nowSnapcode =  versionloglist[0].snapcode ? versionloglist[0].snapcode : '';
        // const data = versionloglist.map((version, index)=>{
        //     return {
        //         versionkey: version.objectId,
        //         versioncode: version.versionnum,
        //         versiondesc: version.versiondesc,
        //         versiondate: version.publishtime,
        //         snapcode: version.snapcode || '',
        //         slbid: version.slbid,
        //         tgid: version.tgid,
        //         info: version.details
        //     }
        // })
        return (
            <div>
                <div className="gl-testinfo-btndiv">
                    <Button className="gl-left-btn" icon="double-left" onClick={this.goBack}>返回</Button>
                </div>
                <Table columns={columns} dataSource={versionloglist.map((version, index)=>{
                    return {
                        key: index + 1,
                        versionkey: version.objectId,
                        versioncode: version.versionnum,
                        versiondesc: version.versiondesc,
                        versiondate: version.publishtime,
                        snapcode: version.snapcode || '',
                        details: <Popover
                            content={<div>
                                <GLPop data={version.details}/></div>}
                                    title={version.versiondesc}
                                     >
                                    <Button icon="book">版本详情</Button>
                                </Popover>,
                        operation: <Popconfirm title="确认回滚策略组到该版本?" onConfirm={() => {
                            let {domainId,domain, port} = _this.props.menu;
                            if(!version || nowSnapcode) return false;
                             _this.props.contentActions.testgroupActions.publishback(versionloglist[0].snapcode, version.snapcode,domain,port, domainId, version.slbid,version.tgid, version.versionnum,version.versiondesc)
                        }}>
                            <Button>回滚</Button>
                        </Popconfirm>


                    }
                })} size="middle" />
            </div>
        );
    }
}


export default GLVersionlog;
