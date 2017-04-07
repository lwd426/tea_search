import React from 'react';
import { Table, Icon } from 'antd';

const columns = [{
  title: '日期',
  dataIndex: 'date',
  key: 'date',
  width: '25%',
  render: text => <a href="#">{text}</a>,
}, {
  title: '用户总量',
  dataIndex: 'useramount',
  key: 'useramount',
  width: '25%',
}, {
  title: '访客数',
  dataIndex: 'visitor',
  key: 'visitor',
  width: '25%',
}, {
  title: '访问用户比例',
  dataIndex: 'persent',
  key: 'persent',
  width: '25%',
}];


const data = [{
  key: '1',
  date: '3-2',
  useramount: 3000,
  visitor: 500,
  persent: '20%',
}, {
  key: '2',
  date: '3-3',
  useramount: 3000,
  visitor: 500,
  persent: '20%',
}, {
  key: '3',
  date: '3-4',
  useramount: 3000,
  visitor: 500,
  persent: '20%',
}];

export default class EChart extends React.Component {

    render() {
        return (
          <div className="tableBox">
            <Table bordered={true} columns={columns} dataSource={data} /> 
          </div>       
        )
    }
}