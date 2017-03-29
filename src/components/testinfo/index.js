import React, { Component, PropTypes } from 'react'
import './style.css';
import 'antd.min.css';
import GLInfo from '../deviceinfo/info'
import { Table, Input, Icon, Button,Modal, Popconfirm } from 'antd';
const confirm = Modal.confirm;

const columns4back = [
    { title: '版本号', width: 80, dataIndex: 'name', key: 'name' },
    { title: '说明', width: 100, dataIndex: 'age', key: 'age' },
    { title: '发布时间', dataIndex: 'address', key: '1' },
    {
        title: '回滚',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => <Popconfirm title="确认回滚到此版本?" onConfirm={() => this.onDelete(index)}>
            <a href="#">回滚</a>
        </Popconfirm>,
    },
];

const data4back = [{
    key: '1',
    name: 'John',
    age: '版本说明哈哈哈哈啊哈和',
    address: '2017/03/17 20:00:00',
}, {
    key: '2',
    name: 'Jim',
    age: 40,
    address: '2017/03/17 20:00:00',
},{
    key: '3',
    name: 'Jim Green',
    age: '版本说明哈哈哈哈啊哈和',
    address: '2017/03/17 20:00:00',
},{
    key: '4',
    name: 'Jimen',
    age: 40,
    address: '2017/03/17 20:00:00',
}];

function showConfirm() {
    confirm({
        title: '请选择回滚到的版本信息?',
        content: <Input placeholder="版本说明（10字以内）" />
    });
}

function showBackWindow() {
    confirm({
        title: '确认发布以下所有策略到服务器?',
        content: <Table columns={columns4back} dataSource={data4back} />
    });
}

class GLGroup extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '策略名称',
            dataIndex: 'stragetyname',
            width: '20%',
        }, {
            title: '状态',
            dataIndex: 'status',
        }, {
            title: '地域',
            dataIndex: 'region',
        }, {
            title: 'URL',
            dataIndex: 'url',
        }, {
            title: 'UID',
            dataIndex: 'uid',
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <span>
                  <a href="#">启动</a>
                  <span className="ant-divider" />
                  <Popconfirm title="确认删除策略?" onConfirm={() => this.onDelete(index)}>
                    <a href="#">删除</a>
                  </Popconfirm>
                </span>
            )
        }];

        this.state = {
            dataSource: [
                { key: 1, stragetyname: '策略一', status: '生效', region: '北京', url: 'm.le.com', uid: '33333333',description: <GLInfo/> },
                { key: 2, stragetyname: '策略一', status: '生效', region: '北京', url: 'm.le.com', uid: '33333333',description: <GLInfo/> },
                { key: 3, stragetyname: '策略一', status: '生效', region: '北京', url: 'm.le.com', uid: '33333333',description: <GLInfo/> },
                { key: 4, stragetyname: '策略一', status: '生效', region: '北京', url: 'm.le.com', uid: '33333333',description: <GLInfo/> },
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
                    <Button className="editable-add-btn" onClick={this.handleAdd}>新增策略</Button>
                    <Button className="editable-add-btn" onClick={showConfirm}>发布到服务器</Button>
                    <Button className="editable-add-btn" onClick={showBackWindow}>回滚</Button>
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
