import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import { Table, Button, Popconfirm } from 'antd';


class GLTestgroup extends React.Component {
    constructor(props) {
        super(props);
        let that = this;
        this.columns = [{
            title: '序号',
            dataIndex: 'id',
            width: '20%',
        }, {
            title: '项目名称',
            dataIndex: 'name',
        }, {
            title: '运行状态',
            dataIndex: 'status',
        },{
            title: '流量占比',
            dataIndex: 'flowaccounting',
        },{
            title: '发布时间',
            dataIndex: 'time',
        },{
            title: '当前版本',
            dataIndex: 'version',
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, stragety) => {
                return (
                <span>
                  <a href="#">改名</a>
                  <span className="ant-divider" />
                  <a href="#" onClick={() => {
                      that.props.contentActions.testinfoActions.edit_stragety(stragety)
                  }}>策略维护</a>
                  <span className="ant-divider" />
                  <Popconfirm title="确认删除策略?" onConfirm={() => {
                      const dataSource = [...that.state.dataSource];
                      dataSource.splice(index, 1);
                      that.setState({ dataSource });
                  }}>
                    <a href="#">删除</a>
                  </Popconfirm>
                </span>
            )}
        }];

        this.state = {
            dataSource: [
                { key:1, id: 1, name: '按照按钮测试', status: 'running', flowaccounting: '未配置',  time:'2017-03-29 10:00:00',version: 'v1.0.0'}
            ]
        };
    }
    onDelete = (index) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    handleAdd = () => {
        const {dataSource } = this.state;
        let count = dataSource.length;
        console.log('dddddd')
        let newData =  {
            id: count,
            name: '',
            status: '-',
            flowaccounting: '未配置',
            time:'2017-03-29 10:00:00',
            version: ''}

        this.setState({
            dataSource: [...dataSource, newData]
        });
    }

    render() {
        const { dataSource } = this.state;
        const columns = this.columns;

        return (
            <div>
                <div className="gl-testinfo-btndiv">
                    <Button className="gl-right-btn" icon="plus" onClick={this.handleAdd}>新增测试项</Button>
                </div>
                <Table className="gl-testinfo-table"
                    columns={columns}
                    dataSource={dataSource}
                />
            </div>
        );
    }
}

GLTestgroup.propTypes = {
    edit_stragety: PropTypes.func.isRequired
}

export default GLTestgroup
