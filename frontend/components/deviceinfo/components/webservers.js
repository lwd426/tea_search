import React, { Component, PropTypes } from 'react';
import '../style.css';
import 'antd.min.css';
import GLTree from './tree';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import EditableCell from './editcell';
const uuid = require('uuid/v1');


const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
};


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
            render: (text, record) => (
                <span>
                    {/*<Popconfirm title="确认设为参照服务器?" onConfirm={() => {*/}
                        {/*console.log(record);*/}
                        {/*that.props.contentActions.deviceinfoActions.updateWebServer({key: record.key}, {refer : '是'});*/}
                    {/*}}>*/}
                        {/*<a href="#">设为参照服务器</a>*/}
                    {/*</Popconfirm>*/}
                    {/*<span className="ant-divider" />*/}
                    <Popconfirm title="确认删除策略?" onConfirm={() => {
                        that.props.contentActions.deviceinfoActions.deleteWebServer(record);
                    }}>
                        <a href="#">删除</a>
                    </Popconfirm>
                </span>
            )
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
            ip: `请输入ip`,
            stragetiesinfo: '-',
            address: '机房',
            backup: '备注',
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
                refer: cell.refer
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
                    rowSelection={rowSelection}
                    dataSource={dataSource}
                    bordered className="gl-testinfo-table"
                    size="middle"
                />
            </div>
        );
    }
}


export default GLWebserver;