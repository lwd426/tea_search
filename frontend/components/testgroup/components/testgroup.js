import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import EditableCell from './editcell'
const uuid = require('uuid/v1');

import { Table, Button, Modal, Popconfirm } from 'antd';
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

class GLTestgroup extends React.Component {
    constructor(props) {
        super(props);
        let that = this;
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            width: '20%',
        }, {
            title: '项目名称',
            dataIndex: 'name',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'name')}
                />
            ),
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
            render: (text, test) => {
                return (
                <span>
                  <a href="#" onClick={that.showBackWindow}>版本日志</a>
                  <span className="ant-divider" />
                  <a href="#" onClick={() => {
                      that.props.contentActions.testgroupActions.edit_stragetylist(test.code, that.props.menu.slbid)
                  }}>策略维护</a>
                  <span className="ant-divider" />
                  <Popconfirm title="确认删除策略?" onConfirm={() => {
                      that.props.contentActions.testgroupActions.deleteTest(that.props.menu.slbid,test.code)
                  }}>
                    <a href="#">删除</a>
                  </Popconfirm>
                </span>
            )}
        }];
    }
    onCellChange = (index, key) => {
        return (value) => {

            const dataSource = [...this.props.content.testgroup.testgrouplist];
            var cell = dataSource[index];
            this.props.contentActions.testgroupActions.updateTest({code:cell.code, slbid: cell.slbid}, {name: value})
        };
    }
    showBackWindow = () => {
        confirm({
            title: '确认发布以下所有策略到服务器?',
            content: <Table columns={columns4back} dataSource={data4back}/>
        });
    }
    onDelete = (index) => {
        const dataSource = [...this.props.content.testgroup.testgrouplist];
        dataSource.splice(index, 1);
        // this.setState({ dataSource });
    }
    handleAdd = () => {
        const slbid = this.props.menu.slbid || '';

        let count = uuid();
        let newData =  {
            key: count ,
            slbid: slbid,
            code:  count,
            name: '',
            status: '-',
            flowaccounting: '未配置',
            time:'',
            version: ''}

        this.props.contentActions.testgroupActions.addTestGroup(newData)
    }
    componentWillReceiveProps =(nextProps)=> {
        if(this.props.menu.slbid === nextProps.menu.slbid) return false;
        if(nextProps.menu.wintype === 'testinfo') this.props.contentActions.testgroupActions.getTestGroupList(nextProps.menu.slbid);

        return true;
    }
    componentWillMount =()=> {
        const slbid = this.props.menu.slbid || '';
        this.props.contentActions.testgroupActions.getTestGroupList(slbid)
    }
    render() {
        const  dataSource = this.props.content.testgroup.testgrouplist.map((cell, index)=>{
            return {
                key: index +1,
                slbid:cell.slbid,
                tgid: cell.objectId,
                code: cell.objectId,
                name: cell.name,
                status: cell.status,
                flowaccounting: cell.flowaccounting,
                time: cell.time,
                version: cell.version
            }
        });
        const columns = this.columns;

        return (
            <div>
                <div className="gl-testinfo-btndiv">
                    <Button className="gl-right-btn" icon="plus" onClick={this.handleAdd}>新增测试项</Button>
                </div>
                <Table bordered className="gl-testinfo-table"
                    columns={columns}
                    size="middle"
                    dataSource={dataSource}
                />
            </div>
        );
    }
}

// GLTestgroup.propTypes = {
//     edit_stragetylist: PropTypes.func.isRequired
// }

export default GLTestgroup
