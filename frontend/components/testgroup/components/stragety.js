import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import GLInfo from '../../deviceinfo/components/info'
import { Table, Input, Icon, Button,Modal, Popconfirm } from 'antd';
const confirm = Modal.confirm;

function showConfirm() {
    confirm({
        title: '请输入版本说明',
        content: <Input placeholder="版本说明（10字以内）" />
    });
}

class GLStragety extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '策略名称',
            dataIndex: 'name',
            width: '20%',
        }, {
            title: '状态',
            dataIndex: 'status',
        }, {
            title: 'web服务器',
            dataIndex: 'server',
        }, {
            title: '生效url',
            dataIndex: 'urls',
        }, {
            title: '生效uid',
            dataIndex: 'uids',
        }, {
            title: '流量占比',
            dataIndex: 'flowaccounting',
        }, {
            title: '标签',
            dataIndex: 'tag',
        },{
            title: '生效时间',
            dataIndex: 'worktime',
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <span>
                  <a href="#" onClick={()=>{
                      this.props.contentActions.testgroupActions.handleStragety(record.code, record.status === "running" ? "stopped" : "running")
                  }}> {record.status === 'running' ? '停止' : '启动'}</a>
                  <span className="ant-divider" />
                  <a href="#" onClick={()=>{
                      this.props.contentActions.testgroupActions.editStragety(record)
                  }}>修改</a>
                  <span className="ant-divider" />
                  <Popconfirm title="确认删除策略?" onConfirm={() => {
                      this.props.contentActions.testgroupActions.deleteStragety(record.code,record.slbid, record.testgroupcode)
                  }}>
                    <a href="#">删除</a>
                  </Popconfirm>
                </span>
            )
        }];

    }
    componentWillReceiveProps =(nextProps)=> {
        return true;
    }
    onDelete = (index) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    handleAdd = () => {
        // const {slbid, tgid} = this.props.content.testgroup;
        this.props.contentActions.testgroupActions.add_stragety()
    }
    generateTags =()=>{
        const {slbid, tgid} = this.props.content.testgroup;
        this.props.contentActions.testgroupActions.generateTags(slbid, tgid);
    }
    generateReferServer=()=>{
        this.props.contentActions.testgroupActions.generateReferServer();
    }
    goBack = () => {
        this.props.contentActions.testgroupActions.goback()
    }
    publish = () => {
        // showConfirm()
        const {slbid} = this.props.content.testgroup;
        this.props.contentActions.testgroupActions.publish(slbid)
    }
    render() {
        const columns = this.columns;
        const  dataSource = this.props.content.testgroup.stragetylist.map((cell, index)=>{
            return {
                key: cell.stra_id,
                slbid:cell.slbid,
                testgroupcode: cell.tgid,
                stragetycode: cell.stra_id,
                code: cell.stra_id,
                name: cell.stra_name,
                desc: cell.stra_desc,
                status: cell.stra_status,
                server: '...',
                serverskey: cell.stra_serverskey,
                urls: '...',
                urlsvalues: cell.stra_urls,
                uids: '...',
                uidsvalues: cell.stra_uids,
                cities: cell.stra_cities,
                flowaccounting: cell.flowaccounting,
                tag: cell.tag,
                worktime: cell.time,
                description: <GLInfo urls={cell.stra_urls.split(';')} servers={cell.stra_servers.split(';')} uids={cell.stra_uids.split(';')}/>
            }
        });
        return (

            <div>
                <div className="gl-testinfo-btndiv">
                    <Button className="gl-left-btn" icon="double-left" onClick={this.goBack}>返回</Button>
                    <Button className="gl-left-btn" icon="upload" onClick={this.publish}>发布到服务器</Button>
                    <Button className="gl-right-btn" icon="compass" onClick={this.generateReferServer}>生成原始版本</Button>
                    <Button className="gl-right-btn" icon="tag" onClick={this.generateTags}>生成数据标签</Button>
                    <Button className="gl-right-btn" icon="plus" onClick={this.handleAdd}>新增策略</Button>
                </div>
                <Table
                    className="gl-testinfo-table"
                    columns={columns}
                    size="middle"
                    expandedRowRender={record => <p>{record.description}</p>}
                    dataSource={dataSource}
                />
            </div>
        );
    }
}


export default GLStragety;
