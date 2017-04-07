import React, { Component, PropTypes } from 'react';
import './style.css';
import 'antd.min.css';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import Chart from './chart.js';
import EChart from './echart.js';

import MyTable from './table.js';

import { Menu, Dropdown, message } from 'antd';
//Cascader
import { Cascader } from 'antd';
const options = [{
  value: 'm',
  label: 'M站灰度测试',
  children: [{
    value: 'button1',
    label: '按钮颜色测试1',
  },{
    value: 'button2',
    label: '按钮颜色测试2',
  }],
}, {
  value: 'pc',
  label: 'PC灰度测试',
  children: [{
    value: 'dianbo1',
    label: '点播页评论1',
  },{
    value: 'dianbo2',
    label: '点播页评论2',
  }],
}];
//const defaultValue = {['m','button1']}

function onChange(value) {
  console.log(value);
}

//Tabs
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;


//Dropdown
function handleButtonClick(e) {
  message.info('Click on left button.');
  console.log('click left button', e);
}
function handleMenuClick(e) {
  message.info('Click on menu item.');
  console.log('click', e);
}
const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">版本一</Menu.Item>
    <Menu.Item key="2">版本二</Menu.Item>
    <Menu.Item key="3">版本三</Menu.Item>
  </Menu>
);

//DatePicker
import { DatePicker } from 'antd';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';




class GLMainpage extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className="mainpage">
                <br />
                <Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu']} options={options} defaultValue={['m','button1']} onChange={onChange} />

                <div className="card-container">
                  <Tabs type="card">
                    <TabPane tab="流量" key="1">
                        <div className="spanBox">
                            <span>流量占比 ：</span> <span> 20% </span>
                        </div>
                        
                        {/*<div className="dropdownBox">
                            <span>策略名称 ：</span>
                            <Dropdown overlay={menu}>
                              <Button>
                                切换版本 <Icon type="down" />
                              </Button>
                            </Dropdown>
                        </div>*/}
                        

                        <div className="rangepickerBox">
                            <RangePicker
                              defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                              format={dateFormat}
                            />
                        </div>

                        <EChart/>

                        <MyTable />

                    </TabPane>
                    <TabPane tab="转化率" key="2">
                        <Chart/>
                    </TabPane>
                  </Tabs>
                </div>
                
            </div>
        );
    }
}


export default GLMainpage;
