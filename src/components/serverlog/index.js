import React, { Component, PropTypes } from 'react'
import './style.css';
import 'antd.min.css';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';


class GLLog extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '版本号',
            dataIndex: 'versioncode',
        }, {
            title: '版本名称',
            dataIndex: 'versionname',
        }, {
            title: '分流策略',
            dataIndex: 'stragety',
        }, {
            title: '上传时间',
            dataIndex: 'date'
        },{
            title: '操作日志',
            dataIndex: 'backup',
        }];

        this.state = {
            dataSource: [{
                key: '0',
                versioncode: 'v10.12.1',
                versionname: '点播页改版',
                stragety: 'M站分流策略1',
                data: '2017-03-14 20:00:00',
                backup: '改版必要的样式和信息',
                description: '改版必要的样式和信息'
            }, {
                key: '1',
                versioncode: 'v10.12.1',
                versionname: '点播页改版',
                stragety: 'M站分流策略1',
                data: '2017-03-14 20:00:00',
                backup: '改版必要的样式和信息',
                description: '改版必要的样式和信息'
            },{
                key: '2',
                versioncode: 'v10.12.1',
                versionname: '点播页改版',
                stragety: 'M站分流策略1',
                data: '2017-03-14 20:00:00',
                backup: '改版必要的样式和信息',
                description: '改版必要的样式和信息'
            },{
                key: '3',
                versioncode: 'v10.12.1',
                versionname: '点播页改版',
                stragety: 'M站分流策略1',
                data: '2017-03-14 20:00:00',
                backup: '改版必要的样式和信息',
                description: '改版必要的样式和信息'
            }],
            count: 4,
        };
    }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
            <div>
                <div>
                    <Button className="editable-add-btn">导出</Button>
                </div>
                <Table bordered size="middle" dataSource={dataSource} columns={columns} />
            </div>
        );
    }
}


export default GLLog;
