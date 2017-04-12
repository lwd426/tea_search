import React, { Component, PropTypes } from 'react';
import '../style.css';
import 'antd.min.css';
import GLTree from './tree';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import EditableCell from './editcell';
const uuid = require('uuid/v1');


class GLWebserver extends React.Component {
    constructor(props) {
        super(props);
        let that = this;
        this.columns = [{
            title: 'IP地址',
            dataIndex: 'ip',
            width: '20%',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'ip')}
                />
            )
        },{
            title: '参照服务器',
            dataIndex: 'refer',
        },{
            title: '策略信息',
            dataIndex: 'stragetyname'
        },{
            title: '机房',
            dataIndex: 'address',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'address')}
                />
            ),
        },{
            title: '备注',
            dataIndex: 'backup',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'backup')}
                />
            ),
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
                console.log(record.refer)
               return ( <span>
                   {record.refer === '是' ? (
                   <Popconfirm title="取消该参照服务器前，请确认该服务器上没有正在生效的策略?" onConfirm={() => {
                       that.props.contentActions.deviceinfoActions.setReferServers([record.key], false);
                    }}><Icon type="eye" />
                   </Popconfirm>) :(<Popconfirm title="设置该服务器为参照服务器?" onConfirm={() => {
                           that.props.contentActions.deviceinfoActions.setReferServers([record.key], true);
                       }}><Icon type="eye-o" />
                       </Popconfirm>)}
                   <span className="ant-divider" />
                    <Popconfirm title="确认删除该服务器?" onConfirm={() => {
                        that.props.contentActions.deviceinfoActions.deleteWebServer(record);
                    }}>
                        <Icon type="delete" />
                    </Popconfirm>
                </span>)
            }
        },];
    }

    onCellChange = (index, keyname) => {
        return (value) => {
            const dataSource = [...this.props.content.deviceinfo.webServerList];
            var cell = dataSource[index];
            this.props.contentActions.deviceinfoActions.updateWebServer({key:cell.key, slbid: cell.slbid}, {[keyname] : value})
        };
    }
    handleAdd = () => {
        const slbid = this.props.menu.slbid || '';
        let key = uuid();
        const newData = {
            key: key,
            slbid: slbid,
            ip: '',
            stragetiesinfo: '-',
            address: '',
            backup: '',
            refer: '否'
        };
        this.props.contentActions.deviceinfoActions.addWebServer(newData);
    }
    componentWillReceiveProps(nextProps) {
        return true;
    }
    componentDidMount() {
    }
    render() {
        const columns = this.columns;
        var dataSource = this.props.content.deviceinfo.webServerList.map((cell, index)=>{
            var stragetyinfo = '';
            cell.stragetiesinfo.map((stragety, index)=>{
                stragetyinfo += stragety.stra_name + ' ';
            })
            return {
                key: cell.key,
                slbid:cell.slbid,
                ip: cell.ip,
                stragetyname: stragetyinfo,
                address: cell.address,
                backup: cell.backup,
                refer: cell.refer ? '是' : '否'
            }
        });
        return (
            <div>
                <div className="gl-testinfo-btndiv">
                    <Button className="gl-right-btn" icon="eye-o" onClick={this.setRefer}>设定为参照服务器</Button>
                    <Button className="gl-right-btn" icon="plus" onClick={this.handleAdd}>新增服务器</Button>
                </div>
                <Table
                    columns={columns}
                    rowSelection={{
                        onSelect: (record, selected, selectedRows) => {
                            {/*var referServers = selectedRows.map((server)=>{*/}
                                {/*return server.key;*/}
                            {/*})*/}
                            {/*this.props.contentActions.deviceinfoActions.setReferServers(referServers);*/}
                        }
                    }}
                    dataSource={dataSource}
                    bordered className="gl-testinfo-table"
                    size="middle"
                />
            </div>
        );
    }
}


export default GLWebserver;