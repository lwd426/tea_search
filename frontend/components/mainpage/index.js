import React, { Component } from 'react';
import './style.css';
import 'antd.min.css';
import { Table, Input, Icon, Button, Popconfirm, Collapse } from 'antd';
import Traffic from './Traffic.js';
import Conversion from './Conversion.js';
import Duiji from './duiji.js';
import request from '../../request';


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
        }
    }
    rangeOnChange(dates, dateStrings) {
        //console.log('From: ', dates[0], ', to: ', dates[1]);
        //console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        this.props.contentActions.mainpageActions.changeDatePicker(dateStrings);
    }
    onChange(value_arr, selectedOptions) {
        //this.props.contentActions.mainpageActions.changeProjectValue(value_arr);
        let stragety_arr = selectedOptions[1].strageties;
        let length = stragety_arr.length;
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
        console.log(res.result.data);
        this.setState({
            mainpage_data: res.result.data
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
            slblist.forEach(function(v,index){
                let obj = {}
                obj['value'] = v.objectId;
                obj['label'] = v.name;

                if(v.testGroups.length > 0){
                    let arr = [];
                    v.testGroups.forEach(function(test_v,index){
                        let inObj ={};
                        if(test_v.strageties.length > 0){
                            let strageties = [] //各个策略的tag 数组
                            test_v.strageties.forEach(function(stragety,index){
                                if(stragety.tag){
                                    strageties.push(stragety.tag)
                                }
                            })
                            if(strageties.length > 0){
                                inObj['value'] = test_v.objectId;
                                inObj['label'] = test_v.name;
                                inObj['strageties'] = strageties;
                            }else{
                                inObj['value'] = test_v.objectId;
                                inObj['label'] = test_v.name + '（所有策略未发布）';
                                inObj['disabled'] = true;
                            }
                            
                            arr.push(inObj)
                        }else{
                            inObj['value'] = test_v.objectId;
                            inObj['label'] = test_v.name + '（项目下无策略）'
                            inObj['disabled'] = true;
                            arr.push(inObj)
                        }
                        
                    })
                    obj['children'] = arr;
                    options[option_idx] = obj;
                    option_idx ++;
                }/*else{
                    obj['label'] = v.name + '（此测试组下无项目）'
                    obj['disabled'] = true;
                }*/
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
        const currentCasVal = this.props.content.mainpage.currentCasVal || ["Please "];
        console.log(currentCasVal)
        return (
            <div className="mainpage">
                <br />
                <Cascader options={options} onChange={this.onChange.bind(this)} value={currentCasVal} expandTrigger='hover' />

                <div className="main-container" style={{display: this.props.content.mainpage.main_container_display}}>

                    <Collapse defaultActiveKey={['1','2','3']} onChange={this.collapseCallback}>
                        {this.state.mainpage_data.map(function(v, index){
                            if(v.testGroups.length > 0){
                                return v.testGroups.map(function(q, idx){
                                    colkey ++;
                                    return(
                                        <Panel header={v.name + '/' + q.name} key={colkey}>
                                            <Button type="primary" className="collbutton" onClick={() =>{
                                                let currentCasVal = [v.objectId, q.objectId];
                                                _this.switchContentShow('none','block', q.strageties, currentCasVal)
                                            }}>
                                                查看详情
                                            </Button>
                                            <div style={{padding:20}}>
                                                <div>
                                                    <span>创建于： { moment(new Date(q.createdAt)).format('YYYY-MM-DD') }  </span>
                                                    <span>已运行： 21天</span>
                                                    <span>最近变动： 1天前</span>
                                                </div>
                                                <div style={{marginTop:10}}>
                                                    {
                                                        q.strageties.map((s, i) => 
                                                            <div key={index + '-' + idx + '-' + i}>
                                                                <div className="left" style={{float:'left',width:'33%'}}>
                                                                    <span>{s.stra_name}</span>
                                                                </div>
                                                                <div className="right" style={{float:'left',width:'33%'}}>
                                                                    <span>流量占比： 20%</span>
                                                                </div>
                                                                <div className="right" style={{float:'left',width:'34%'}}>
                                                                    <span>{s.tag ? '运行中' : '没有运行'}</span><br/>
                                                                </div>
                                                                <div className="clear"></div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                
                                            </div>
                                        </Panel>
                                    )
                                })
                            }
                        })}

                    </Collapse>
                </div>

                <div className="card-container" style={{display: this.props.content.mainpage.card_container_display}}>
                
                <Button className="device_button" type="primary">
                    设备信息 
                </Button>
                <Button className="stragety_button" type="primary">
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
                              defaultValue={[moment().subtract(7, 'days'), moment()]}
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
