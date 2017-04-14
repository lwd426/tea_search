import React, { Component } from 'react';
import './style.css';
import 'antd.min.css';
import { Table, Input, Icon, Button, Popconfirm, Collapse } from 'antd';
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
const Panel = Collapse.Panel;


class GLMainpage extends React.Component {
    constructor(props) {
        super(props);
    }
    rangeOnChange(dates, dateStrings) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        this.props.contentActions.mainpageActions.changeDatePicker(dateStrings);
    }
    onChange(arr) {
        console.log(arr);
        this.props.contentActions.mainpageActions.changeProjectValue(arr);
        let projectValue = arr[1];
        this.props.contentActions.mainpageActions.switchContentShow('none','block')
    }
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }
    collapseCallback(key) {
        console.log(key);
    }
    componentDidMount(){
        //this.props.contentActions.mainpageActions.getStragety()
        this.props.contentActions.mainpageActions.getMenulist();
        this.props.contentActions.mainpageActions.getTestGroupList();
    }
    componentWillReceiveProps(nextProps) {
        console.log('mainpage componentWillReceiveProps');
        //console.log(nextProps.content.mainpage.stragety);
        return true;
    }
    
    render() {
        //const options = this.props.content.mainpage.stragety
        let options = [];
        let slblist = this.props.content.mainpage.menulist;
        let testgrouplist = this.props.content.mainpage.testgrouplist;
        if(slblist.length > 0 ){
            slblist.forEach(function(outv,index){
                let obj = {}
                obj['value'] = outv.objectId;
                obj['label'] = outv.name;

                if(testgrouplist.length > 0){
                    let arr = [];
                    testgrouplist.forEach(function(inv,index){
                        let inObj = {};
                        if( outv.objectId == inv.slbid ){
                            inObj['value'] = inv.objectId;
                            inObj['label'] = inv.name;
                            arr.push(inObj);
                        }
                    })
                    obj['children'] = arr;
                }
                options[index] = obj;
            })
        }

        //let defaultValue = (options.length > 0) ? [ options[0]['value'],options[0]['children'][0]['value'] ] : [];
        

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
                <Cascader options={options} onChange={this.onChange.bind(this)} />
                <Button style={{float:'right'}}>
                  <Icon type="plus-circle-o" />新建测试组 
                </Button>

                <div className="main-container" style={{display: this.props.content.mainpage.main_container_display}}>

                    <Collapse defaultActiveKey={['1','2','3','4']} onChange={this.collapseCallback}>
                        <Panel header="M站灰度测试/按钮颜色测试1  (4条分流策略  3条运行中)" key="1">
                            <Button type="primary" className="collbutton" onClick={() =>{this.props.contentActions.mainpageActions.switchContentShow('none','block')}}>
                                查看详情
                            </Button>
                            <div style={{padding:20}}>
                                <div className="left" style={{float:'left',width:'33%'}}>
                                    <span>创建于：2017年3月21日</span><br/>
                                    <span>已运行： 21天</span><br/>
                                    <span>最近变动： 1天前</span><br/>
                                </div>
                                <div className="right" style={{float:'left',width:'33%'}}>
                                    <span>BtnClick：3.6%</span> <span className="increase">(+4.2%)</span><br/>
                                    <span>PicClick：2.6%</span> <span className="decrease">(-2.1%)</span><br/>
                                    <span>PicClick：2.6%</span> <span className="decrease">(-2.1%)</span><br/>
                                </div>
                                <div className="right" style={{float:'left',width:'34%'}}>
                                    <span>流量占比： 20%   运行中</span><br/>
                                    
                                </div>
                                <div className="clear"></div>
                            </div>
                        </Panel>
                        <Panel header="M站灰度测试/按钮颜色测试2  (4条分流策略  3条运行中)" key="2">
                            <Button type="primary" className="collbutton" onClick={() =>{this.props.contentActions.mainpageActions.switchContentShow('none','block')}}>
                                查看详情
                            </Button>
                            <div style={{padding:20}}>
                                <div className="left" style={{float:'left',width:'33%'}}>
                                    <span>创建于：2017年3月21日</span><br/>
                                    <span>已运行： 21天</span><br/>
                                    <span>最近变动： 1天前</span><br/>
                                </div>
                                <div className="right" style={{float:'left',width:'33%'}}>
                                    <span>BtnClick：3.6%</span> <span className="increase">(+4.2%)</span><br/>
                                    <span>PicClick：2.6%</span> <span className="decrease">(-2.1%)</span><br/>
                                    <span>PicClick：2.6%</span> <span className="decrease">(-2.1%)</span><br/>
                                </div>
                                <div className="right" style={{float:'left',width:'34%'}}>
                                    <span>流量占比： 20%   运行中</span><br/>
                                    
                                </div>
                                <div className="clear"></div>
                            </div>
                        </Panel>
                        <Panel header="PC灰度测试/点播页评论1  (4条分流策略  3条运行中)" key="3">
                            <Button type="primary" className="collbutton" onClick={() =>{this.props.contentActions.mainpageActions.switchContentShow('none','block')}}>
                                查看详情
                            </Button>
                            <div style={{padding:20}}>
                                <div className="left" style={{float:'left',width:'33%'}}>
                                    <span>创建于：2017年3月21日</span><br/>
                                    <span>已运行： 21天</span><br/>
                                    <span>最近变动： 1天前</span><br/>
                                </div>
                                <div className="right" style={{float:'left',width:'33%'}}>
                                    <span>BtnClick：3.6%</span> <span className="increase">(+4.2%)</span><br/>
                                    <span>PicClick：2.6%</span> <span className="decrease">(-2.1%)</span><br/>
                                    <span>PicClick：2.6%</span> <span className="decrease">(-2.1%)</span><br/>
                                </div>
                                <div className="right" style={{float:'left',width:'34%'}}>
                                    <span>流量占比： 20%   运行中</span><br/>
                                    
                                </div>
                                <div className="clear"></div>
                            </div>
                        </Panel>
                        <Panel header="PC灰度测试/点播页评论2  (4条分流策略  3条运行中)" key="4">
                            <Button type="primary" className="collbutton" onClick={() =>{this.props.contentActions.mainpageActions.switchContentShow('none','block')}}>
                                查看详情
                            </Button>
                            <div style={{padding:20}}>
                                <div className="left" style={{float:'left',width:'33%'}}>
                                    <span>创建于：2017年3月21日</span><br/>
                                    <span>已运行： 21天</span><br/>
                                    <span>最近变动： 1天前</span><br/>
                                </div>
                                <div className="right" style={{float:'left',width:'33%'}}>
                                    <span>BtnClick：3.6%</span> <span className="increase">(+4.2%)</span><br/>
                                    <span>PicClick：2.6%</span> <span className="decrease">(-2.1%)</span><br/>
                                    <span>PicClick：2.6%</span> <span className="decrease">(-2.1%)</span><br/>
                                </div>
                                <div className="right" style={{float:'left',width:'34%'}}>
                                    <span>流量占比： 20%   运行中</span><br/>
                                    
                                </div>
                                <div className="clear"></div>
                            </div>
                        </Panel>
                    </Collapse>
                </div>

                <div className="card-container" style={{display: this.props.content.mainpage.card_container_display}}>
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
                        <MyTable {...this.props}/>
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
