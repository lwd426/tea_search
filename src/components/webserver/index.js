import React, { Component, PropTypes } from 'react'
import './style.css';
import 'antd.min.css';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            editable: false,
        }
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}

class GLSlb extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: 'IP地址',
            dataIndex: 'ip',
            width: '20%',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'name')}
                />
            ),
        }, {
            title: '所属分组',
            dataIndex: 'group',
        }, {
            title: '策略',
            dataIndex: 'stragety',
        }, {
            title: '机房',
            dataIndex: 'address'
        },{
            title: '备注',
            dataIndex: 'backup',
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <span>
                  <a href="#">编辑</a>
                  <span className="ant-divider" />
                  <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)}>
                    <a href="#">Delete</a>
                  </Popconfirm>
                </span>
            )
        }];

        this.state = {
            dataSource: [{
                key: '0',
                ip: '192.168.1.1',
                group: 'web分组1',
                stragety: '策略1',
                address: '机房1',
                backup: '备注一一',
                description: 'ddddd'
            }, {
                key: '1',
                ip: '192.168.1.1',
                group: 'web分组1',
                stragety: '策略1',
                address: '机房1',
                backup: '备注一一',
                description: 'ddddd'
            },{
                key: '3',
                ip: '192.168.1.1',
                group: 'web分组1',
                stragety: '策略1',
                address: '机房1',
                backup: '备注一一',
                description: 'ddddd'
            },{
                key: '4',
                ip: '192.168.1.1',
                group: 'web分组1',
                stragety: '策略1',
                address: '机房1',
                backup: '备注一一',
                description: 'ddddd'
            }],
            count: 4,
        };
    }
    onCellChange = (index, key) => {
        return (value) => {
            const dataSource = [...this.state.dataSource];
            dataSource[index][key] = value;
            this.setState({ dataSource });
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
                    <Button className="editable-add-btn" onClick={this.handleAdd}>新增</Button>
                    <Button className="editable-add-btn" onClick={this.handleAdd}>批量删除</Button>
                </div>
                <Table bordered size="middle" dataSource={dataSource} columns={columns} />
            </div>
        );
    }
}


export default GLSlb;
