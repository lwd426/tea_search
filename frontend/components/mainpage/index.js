import React, { Component, PropTypes } from 'react';
import './style.css';
import 'antd.min.css';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import Chart from './chart.js';
import EChart from './echart.js';
import Duiji from './duiji.js';

import MyTable from './table.js';

import { Menu, Dropdown, message } from 'antd';
//Cascader
import { Cascader } from 'antd';

//Tabs
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;


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
    componentWillReceiveProps(nextProps) {
        console.log('mainpage componentWillReceiveProps');
        //console.log(nextProps.content.mainpage.stragety);
        return true;
    }
    rangeOnChange(dates, dateStrings) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        this.props.contentActions.mainpageActions.changeDatePicker(dateStrings);
    }
    onChange(arr) {
        console.log(arr);
        this.props.contentActions.mainpageActions.changeProjectValue(arr);
    }
    disabledDate(current) {
      // can not select days before today and today
      return current && current.valueOf() > Date.now();
    }
    
    render() {
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

        const options_two = [{
            value: 'BtnClick',
            label: 'BtnClick',
        }, {
            value: 'PicClick',
            label: 'PicClick',
        }];

        return (
            <div className="mainpage">
                <br />
                <Cascader options={options} defaultValue={['m','button1']} onChange={this.onChange.bind(this)} />

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
                              defaultValue={[moment().subtract(7, 'days'), moment()]}
                              format={dateFormat}
                              onChange={this.rangeOnChange.bind(this)}
                              disabledDate={this.disabledDate.bind(this)}
                            />
                        </div>
                        <EChart {...this.props}/>
                        <MyTable />
                    </TabPane>

                    <TabPane tab="转化率(多版本)" key="2">

                        <div className="rangepickerBox">
                            <RangePicker
                                defaultValue={[moment().subtract(7, 'days'), moment()]}
                                format={dateFormat}
                                onChange={this.rangeOnChange.bind(this)}
                                disabledDate={this.disabledDate.bind(this)}
                            />
                        </div>
                        <div className="CascaderBox">
                            <span>优化指标 ：</span>
                            <Cascader options={options_two} defaultValue={['BtnClick']} onChange={this.onChange} />
                        </div>
                        <div className="clear"></div>

                        <div id = "content_one" style={{display:this.props.content.mainpage.content_one_display}}>
                            <Chart {...this.props}/>
                        </div>

                        <div id = "content_two" style={{display: this.props.content.mainpage.content_two_display}}>
                            <Button type="primary" className="back" onClick={() => {
                                this.props.contentActions.mainpageActions.changeContentDisplay('block','none');
                            }}><Icon type="left" />返回</Button>
                            <Duiji {...this.props}/>
                        </div>

                    </TabPane>

                  </Tabs>
                </div>
                
            </div>
        );
    }
}


export default GLMainpage;
