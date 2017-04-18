import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import EditableCell from './editcell'
const uuid = require('uuid/v1');
import utilscomps from '../../utilscomps'

import { Table, Button, Modal, Popconfirm } from 'antd';

class GLTestgroup extends React.Component {
    constructor(props) {
        super(props);
        let that = this;
        this.columns = [{
            title: '序号',
            dataIndex: 'num',
            width: '5%',
        }, {
            title: '项目名称',
            dataIndex: 'name',
            render: (text, record, index) => (
                <EditableCell
                    item="name"
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
                  <a href="#" onClick={()=>{
                      that.props.contentActions.testgroupActions.versionlog_list(test.code, that.props.menu.slbid)
                  }}>版本日志</a>
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
    onDelete = (index) => {
        const dataSource = [...this.props.content.testgroup.testgrouplist];
        dataSource.splice(index, 1);
        // this.setState({ dataSource });
    }
    handleAdd = () => {
        let {testgrouplist} = this.props.content.testgroup;
        if(testgrouplist && testgrouplist[0] && testgrouplist[0].name === ''){
            utilscomps.showNotification('warning', '提示', '您有为添加完成的策略组，请先添加完毕！' );
            return false;
        }
        const slbid = this.props.menu.slbid || '';
        let count = uuid();
        let newData =  {
            key: count ,
            slbid: slbid,
            code:  count,
            name: '',
            status: '-',
            flowaccounting: '',
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
        return (
            <div>
                <div className="gl-testinfo-btndiv">
                    <Button className="gl-right-btn" icon="plus" onClick={this.handleAdd}>新增测试项</Button>
                </div>
                <Table className="gl-testinfo-table"
                    columns={this.columns}
                    size="middle"
                    dataSource={this.props.content.testgroup.testgrouplist.map((cell, index)=>{
                        return {
                            key:  cell.objectId,
                            num: index + 1,
                            slbid: cell.slbid,
                            tgid: cell.objectId,
                            code: cell.objectId,
                            name: cell.name,
                            status: cell.status,
                            flowaccounting: cell.flowaccounting,
                            time: cell.time,
                            version: cell.version
                        }
                    })}
                />
            </div>
        );
    }
}

// GLTestgroup.propTypes = {
//     edit_stragetylist: PropTypes.func.isRequired
// }

export default GLTestgroup
