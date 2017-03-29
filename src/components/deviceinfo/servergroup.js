import React, { Component, PropTypes } from 'react'
import './style.css';
import 'antd.min.css';
import GLTree from './tree'
import { Table, Input, Icon, Button, Popconfirm } from 'antd';


class GLGroup extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '组名称',
            dataIndex: 'groupname',
            width: '20%',
        }, {
            title: '服务器数量',
            dataIndex: 'servernum',
        }, {
            title: '策略名称',
            dataIndex: 'stragetyname',
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
                { key: 1, groupname: 'web分组1', servernum: 32, stragetyname: '策略名称',  description: <GLTree/> },
                { key: 2, groupname: 'web分组2', servernum: 42, stragetyname: '策略名称',  description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
                { key: 3, groupname: 'web分组3', servernum: 32, stragetyname: '策略名称',  description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
                { key: 4, groupname: 'web分组4', servernum: 32, stragetyname: '策略名称', description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
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
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;

        return (
            <div>
                <div>
                    <Button className="editable-add-btn" onClick={this.handleAdd}>新增分组</Button>
                </div>
                <Table
                    columns={columns}
                    expandedRowRender={record => <p>{record.description}</p>}
                    dataSource={dataSource}
                />
            </div>
        );
    }
}


export default GLGroup;