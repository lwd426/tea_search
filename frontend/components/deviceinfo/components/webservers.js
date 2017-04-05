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


class GLGroup extends React.Component {
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
                    onChange={this.onCellChange(index)}
                />
            ),
        },{
            title: '策略名称',
            dataIndex: 'stragetyname',
        },{
            title: '机房',
            dataIndex: 'address',
        },{
            title: '备注',
            dataIndex: 'backup',
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <span>
                  <a href="#">确认</a>
                  <span className="ant-divider" />
                  <Popconfirm title="确认删除策略?" onConfirm={() => {
                      console.log(record);
                      that.props.contentActions.deviceinfoActions.deleteWebServer(record.key);
                  }}>
                    <a href="#">删除</a>
                  </Popconfirm>
                </span>
            )
        }];

        this.state = {
            dataSource: [
                { key: 1, ip: '10.200.38.184', qps: 32, stragetyname: '按钮颜色测试',  address:'北京联通机房',backup: 'ddd'}
                // { key: 2, ip: '10.200.38.185', qps: 42, stragetyname: '播放记录改版',  address:'北京联通机房',backup: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
                // { key: 3, ip: '10.200.38.186', qps: 32, stragetyname: '按钮颜色测试',  address:'北京联通机房',backup: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
                // { key: 4, ip: '10.200.38.187', qps: 32, stragetyname: '播放记录改版', address:'北京联通机房',backup: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
            ],
            count: 4,
        };
    }
    onDelete = (index) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    onCellChange = (index) => {
        return (value) => {
            const dataSource = [...this.props.content.deviceinfo.webServerList];
            var cell = dataSource[index];
            this.props.contentActions.deviceinfoActions.updateWebServer({key:cell.key, slbid: cell.slbid}, {ip: value})
        };
    }
    handleAdd = () => {
        const slbid = this.props.menu.slbid || '';
        let key = uuid();
        //console.log('ddd ' + slbid);
        const newData = {
            key: key,
            slbid: slbid,
            ip: `10.200.38.18444`,
            stragetyname: '策略名称',
            address: '机房',
            backup: '备注'
        };
        /*this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });*/

        this.props.contentActions.deviceinfoActions.addWebServer(newData);
    }
    componentWillReceiveProps(nextProps) {
        return true;
    }
    componentDidMount =()=> {
        const slbid = this.props.menu.slbid || '';
        this.props.contentActions.deviceinfoActions.getWebServerList(slbid);
    }
    render() {
        const columns = this.columns;
        //console.log(this.props)
        console.log('rerender');
        const dataSource = this.props.content.deviceinfo.webServerList.map((cell, index)=>{
            return {
                key: cell.key,
                slbid:cell.slbid,
                ip: cell.ip,
                stragetyname: cell.stragetyname,
                address: cell.address,
                backup: cell.backup
            }
        });
        console.log(dataSource)//第一次进来没数据，在切换就有数据了，什么原因？
        return (
            <div>
                <div>
                    <Button className="server-btn" onClick={this.handleAdd}>新增服务器</Button>
                    <Button className="server-btn" onClick={this.handleAdd}>设定为参照服务器</Button>
                </div>
                <Table
                    columns={columns}
                    rowSelection={rowSelection}
                    dataSource={dataSource}
                />
            </div>
        );
    }
}


export default GLGroup;