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
    switchContentShow(none, block, arr){
        let strageties = [];
        arr.map((val, index) => 
            strageties.push(val.tag)
        )
        console.log(strageties)
        this.props.contentActions.mainpageActions.switchContentShow(none,block,strageties)
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

        if(slblist.length > 0 ){
            slblist.forEach(function(v,index){
                let obj = {}
                obj['value'] = v.objectId;
                obj['label'] = v.name;

                if(v.testGroups.length > 0){
                    let arr = [];
                    v.testGroups.forEach(function(test_v,index){
                        let inObj ={};
                        inObj['value'] = test_v.objectId;
                        inObj['label'] = test_v.name;
                        arr.push(inObj)
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

        const _this = this;

        return (
            <div className="mainpage">
                <br />
                <Cascader options={options} onChange={this.onChange.bind(this)} />
                {/*<Button style={{float:'right'}}>
                    <Icon type="plus-circle-o" />新建测试组 
                </Button>*/}

                <div className="main-container" style={{display: this.props.content.mainpage.main_container_display}}>

                    <Collapse defaultActiveKey={['0-0','0-1']} onChange={this.collapseCallback}>
                        {this.state.mainpage_data.map(function(v, index){
                            if(v.testGroups.length > 0){
                                return v.testGroups.map(function(q, idx){
                                    return(
                                        <Panel header={v.name + '/' + q.name} key={index + '-' +idx}>
                                            <Button type="primary" className="collbutton" onClick={() =>{_this.switchContentShow('none','block',q.strageties)}}>
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
                                                                    <span>运行中</span><br/>
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

                    <TabPane tab="转化率(多版本)" key="2">

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
