import React, { Component, PropTypes } from 'react';
import '../style.css';
import 'antd.min.css';
import GLTree from './tree';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';


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
        this.columns = [{
            title: 'IP地址',
            dataIndex: 'ip',
            width: '20%',
        }, {
            title: 'qps',
            dataIndex: 'qps',
        }, {
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
                  <Popconfirm title="确认删除策略?" onConfirm={() => this.onDelete(index)}>
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
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            ip: `0.200.38.18 ${count}`,
            qps: 32,
            stragetyname: '按钮颜色',
            address: `London, Park Lane no. ${count}`,
            backup: 'spring'
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }
    componentWillReceiveProps(nextProps) {
        return true;
    }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        const slbid = this.props.menu.slbid || '';
        console.log(slbid);

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