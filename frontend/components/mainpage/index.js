import React, { Component } from 'react';
import './style.css';
import 'antd.min.css';
import { Table, Input, Icon, Button, Popconfirm, Collapse } from 'antd';
import Traffic from './Traffic.js';
import Conversion from './Conversion.js';
import Duiji from './duiji.js';
import request from '../../request';
import { setMainPageOptions, setMainPageData } from './lib';


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
        this.state = {
            mainpage_data: [],
            testGroupsArr: [],
        }
    }
    rangeOnChange(dates, dateStrings) {
        //console.log('From: ', dates[0], ', to: ', dates[1]);
        //console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        this.props.contentActions.mainpageActions.changeDatePicker(dateStrings);
    }
    onChange(value_arr, selectedOptions) {
        //this.props.contentActions.mainpageActions.changeProjectValue(value_arr);
        //console.log(selectedOptions)
        let stragety_arr = selectedOptions[1].strageties;
        let length = stragety_arr.length;
        if(length > 0){
            let str = '[';
            stragety_arr.map((val,index) => {
                str += '"'
                str += val;
                str += '"';
                if(index < (length - 1)){
                    str += ','
                }
            })
            str += ']';
            this.props.contentActions.mainpageActions.switchContentShow('none','block',str,value_arr)
        }else{
            alert('此项目无数据！')
        }
        
    }
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }
    collapseCallback(key) {
        console.log(key);
    }
    switchContentShow(none, block, arr, currentCasVal){
        let strageties = [];
        arr.map((val, index) => {
            if(val.tag){
                strageties.push(val.tag)
            }  
        })

        let length = strageties.length;
        if(length > 0){
            let str = '[';
            strageties.map((val, index) => {
                str += '"'
                str += val;
                str += '"';
                if(index < (length - 1)){
                    str += ','
                } 
            })
            str += ']';
            this.props.contentActions.mainpageActions.switchContentShow(none,block,str,currentCasVal)
        }else{
            alert('此项目无数据！')
        }
    }
    tabChange(key){
        console.log(key);
        this.props.contentActions.mainpageActions.switchTable(key);
    }
    async componentWillMount(){
        let res = await request.getAllStrategies();
        //console.log(res.result.data);

        let testGroupsArr = setMainPageData(res.result.data);
        //console.log(testGroupsArr);

        this.setState({
            mainpage_data: res.result.data,
            testGroupsArr: testGroupsArr
        })
    }
    componentDidMount(){
        //this.props.contentActions.mainpageActions.getMenulist();
        //this.props.contentActions.mainpageActions.getTestGroupList();
    }
    componentWillReceiveProps(nextProps) {
        console.log('mainpage componentWillReceiveProps');
        //console.log(nextProps.content.mainpage.stragety);
        return true;
    }
    
    render() {
        let options = [];
        let slblist = this.state.mainpage_data;

        let option_idx = 0;

        if(slblist.length > 0 ){
            slblist.forEach(function(slb,index){
                let obj = {}
                obj['value'] = slb.objectId;
                obj['label'] = slb.name;

                if(slb.testGroups.length > 0){
                    let arr = [];
                    arr = setMainPageOptions(slb.testGroups, arr, 'running');
                    arr = setMainPageOptions(slb.testGroups, arr, 'new');
                    arr = setMainPageOptions(slb.testGroups, arr, 'stopped');
                    obj['children'] = arr;
                    options.push(obj);
                }
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

        const _this = this;
        let colkey = 0;
        const currentCasVal = this.props.content.mainpage.currentCasVal;
        return (
            <div className="mainpage">
                <Cascader placeholder="请选择" options={options} onChange={this.onChange.bind(this)} value={currentCasVal} expandTrigger='hover' />

                <div className="main-container" style={{display: this.props.content.mainpage.main_container_display}}>

                    <Collapse defaultActiveKey={['1','2','3']} onChange={this.collapseCallback}>
                        {this.state.testGroupsArr.map((q, index) =>
                            <Panel 
                                header={
                                    <div>
                                        <span>{q.slb_name + '/' + q.name}</span>
                                        <Button className="collbutton" onClick={(e) =>{
                                            e.stopPropagation();
                                            let currentCasVal = [q.slb_objectId, q.objectId];
                                            _this.switchContentShow('none','block', q.strageties, currentCasVal)
                                        }}>
                                            查看详情
                                        </Button>
                                    </div>
                                } 
                                key={index+1}
                            >
                                
                                <div style={{padding:20}}>
                                    <div style={{color:'#555'}}>
                                        <span>创建于：{ moment(new Date(q.createdAt)).format('YYYY-MM-DD') }  </span>
                                        <span style={{marginLeft:'20px'}}>
                                            已运行：{q.first_publish_time? ((new Date().getTime() - new Date(q.first_publish_time).getTime())/(24*60*60*1000)).toFixed(1) : 0} 天
                                        </span>
                    
                                        <span style={{marginLeft:'20px'}}>
                                            {(() => {
                                                if(q.time != '-'){
                                                    let num = ((new Date().getTime() - new Date(q.time).getTime())/(24*60*60*1000)).toFixed(1);
                                                    if(num < 1) return '最近修改 ：' + '今天';
                                                    if(num >= 1)return '最近修改 ：' + num + '天前';
                                                }else{
                                                    return '最近修改 ：无';
                                                }
                                            })()}
                                        </span>
                                    
                                    </div>
                                    <div style={{marginTop:20}}>
                                        {
                                            q.strageties.map((s, i) => 
                                                <div key={index + '-' + i} style={{padding:3}}>
                                                    <div className="left" style={{float:'left',width:'33%'}}>
                                                        <span>{s.stra_name}</span>
                                                    </div>
                                                    <div className="right" style={{float:'left',width:'33%'}}>
                                                        <span>
                                                            {(()=> {
                                                                if(s.stra_uids.length > 0 && s.stra_cities.length > 0){
                                                                    return '特殊用户和特殊地域';
                                                                }else if(s.stra_uids.length > 0){
                                                                    return '特殊用户';
                                                                }else if(s.stra_cities.length > 0){
                                                                    return '特殊地域';
                                                                }else if(s.stra_servers.length==0||q.slb_servers.length==0){
                                                                    return '流量占比：' + '0';
                                                                }else{
                                                                    return '流量占比：' + ((s.stra_servers.length)*100/(q.slb_servers.length)).toFixed(2) + '%'
                                                                }
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <div className="right" style={{float:'left',width:'34%'}}>
                                                        <span>{q.status}</span><br/>
                                                    </div>
                                                    <div className="clear"></div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    
                                </div>
                            </Panel>
                        )}

                    </Collapse>
                </div>

                <div className="card-container" style={{display: this.props.content.mainpage.card_container_display}}>
                
                <Button className="device_button" onClick={()=>{
                    this.props.menuActions.changeShowWinType(this.props.menu.slbid, 'deviceinfo');
                }}>
                    设备信息 
                </Button>
                <Button className="stragety_button"  onClick={()=>{
                    this.props.menuActions.changeShowWinType(this.props.menu.slbid, 'testinfo');
                }}>
                    策略维护 
                </Button>

                  <Tabs type="card" onChange={this.tabChange.bind(this)}>
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
                              defaultValue={[moment().subtract(5, 'days'), moment().subtract(1, 'days')]}
                              format={dateFormat}
                              onChange={this.rangeOnChange.bind(this)}
                              disabledDate={this.disabledDate.bind(this)}
                            />
                        </div>
                        <Traffic {...this.props}/>
                    </TabPane>

                    <TabPane tab="转化率" key="2">

                        {/*<div className="rangepickerBox">
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
                        <div className="clear"></div>*/}

                        <div id = "content_one" style={{display:this.props.content.mainpage.content_one_display}}>
                            <Conversion {...this.props}/>
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
