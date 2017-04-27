import React, { Component } from 'react';
import './style.css';
import 'antd.min.css';
import { Table, Input, Icon, Button,Popover,Cascader, Card,Tabs , Menu, Dropdown, message,Popconfirm, Collapse } from 'antd';
import Traffic from './Traffic.js';
import Conversion from './Conversion.js';
import Duiji from './duiji.js';
import utilscomps from '../utilscomps'

import request from '../../request';
import { setMainPageOptions, setMainPageData } from './lib';


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
        this.props.contentActions.mainpageActions.changeDatePicker(dateStrings);
    }
    onChange(value_arr, selectedOptions) {
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
            utilscomps.showNotification('warning', '提示', '此项目无数据，请进行策略维护后重试！' );

        }

    }
    disabledDate(current) {
        return current && current.valueOf() > (Date.now() - 24*3600*1000);
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
            utilscomps.showNotification('warning', '提示', '此项目无数据，请进行策略维护后重试！' );
        }
    }
    tabChange(key){
        this.props.contentActions.mainpageActions.switchTable(key);
    }
    componentWillMount(){
        var  _this = this;
        let res = request.getAllStrategies((res)=>{
            let testGroupsArr = setMainPageData(res.result.data);
            _this.setState({
                mainpage_data: res.result.data,
                testGroupsArr: testGroupsArr
            })
        });


    }
    componentDidMount(){
        //this.props.contentActions.mainpageActions.getMenulist();
        //this.props.contentActions.mainpageActions.getTestGroupList();
    }
    componentWillReceiveProps(nextProps) {
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
                    if(arr.length > 0){
                        obj['children'] = arr;
                        options.push(obj);
                    }
                }
            })
        }
        const options_two = [{
            value: 'BtnClick',
            label: 'BtnClick',
        }, {
            value: 'PicClick',
            label: 'PicClick',
        }];

        const _this = this;
        let colkey = 0;
        const wintype = this.props.menu.wintype;
        const {currentCasVal, card_container_display, main_container_display, main_card_key} = this.props.content.mainpage;
        let toolbarType = 'mainpage_main';
        // const {toolbarType, toolbarData} = this.props.app;
        if(wintype === 'mainpage' && card_container_display === 'none' && main_container_display === 'block'){
            toolbarType = 'mainpage_main'
        }else if(wintype === 'mainpage' && card_container_display === 'block' && main_container_display === 'none'){
            toolbarType = 'mainpage_details'
        }
        return (
            <div className="mainpage">
                <div className="quickBox">
                    <div className={toolbarType === 'mainpage_main' ? (this.props.app.collapsed ? "center" : "center close" ) : "center hidden"}>
                        <Button icon="setting" className={this.props.app.collapsed ? "gl-main-l-btn" : "gl-main-l-btn close"} onClick={this.props.appActions.changeSettingBtn}>{this.props.app.collapsed ? '打开配置面板' : '关闭配置面板'}</Button>
                        <Popover   content={<Cascader placeholder="请选择" options={options} onChange={this.onChange.bind(this)} value={currentCasVal} expandTrigger='hover' />
                        } title={null} trigger="click">
                            <Button icon="scan" className="gl-main-r-btn">测试组快捷入口</Button>
                        </Popover>
                    </div>
                    <div className={toolbarType === 'mainpage_details' ? "center-details" : "center-details hidden"}>
                        {/*<Button icon="home" className="gl-main-ll-btn" onClick={()=>{*/}
                            {/*this.props.menuActions.changeShowWinType(0, 'mainpage');*/}
                            {/*this.props.content.mainpage.card_container_display = 'none';*/}
                            {/*this.props.content.mainpage.content_one_display = 'block'*/}
                            {/*this.props.content.mainpage.main_container_display = 'block'*/}
                            {/*this.props.content.mainpage.content_two_display = 'none';*/}
                            {/*this.props.content.mainpage.currentCasVal = undefined;*/}
                            {/*this.props.app.collapsed = true;*/}
                        {/*}}> 返回home </Button>*/}
                        <Button icon="bar-chart" className="gl-main-ll-btn"  onClick={()=>{
                            this.props.contentActions.mainpageActions.switchTable('1')
                        }}>流量</Button>
                        <Button icon="bar-chart" className="gl-main-mm-btn"   onClick={()=>{
                            this.props.contentActions.mainpageActions.switchTable('2')
                        }}>转化率</Button>
                        <Button icon="database" className="gl-main-mm-btn"  onClick={()=>{
                            this.props.menuActions.changeShowWinType(this.props.menu.slbid, 'deviceinfo');
                        }}>设备信息</Button>
                        <Button icon="right" className="gl-main-rr-btn" onClick={()=>{
                            this.props.menuActions.changeShowWinType(this.props.menu.slbid, 'testinfo');
                            this.props.contentActions.testgroupActions.edit_stragetylist(currentCasVal[1],currentCasVal[0]);
                        }} >策略维护</Button>
                    </div>
                </div>



                <div className="main-container" style={{display: this.props.content.mainpage.main_container_display}}>

                        {this.state.testGroupsArr.map((q, index) =>
                        <Card title={q.slb_name + '/' + q.name} key={index+1} extra={<a href="#" onClick={(e) =>{
                            e.stopPropagation();
                            let currentCasVal = [q.slb_objectId, q.objectId];
                            this.props.menu.slbid = currentCasVal[0] || '';
                            _this.switchContentShow('none','block', q.strageties, currentCasVal)
                            this.props.menu.openSlb = q.slb_objectId;
                            this.props.menu.selectedSubMenu = '';
                        }}>详情</a>} >
                            <div style={{padding:10}}>
                                <div className="gl-m-lefttitle">
                                    <span>创建于：{ moment(new Date(q.createdAt)).format('YYYY-MM-DD') }  </span>
                                    <span style={{marginLeft:'20px'}}>
                                            已运行：{q.first_publish_time? Math.ceil((new Date().getTime() - new Date(q.first_publish_time.replace(/-/g, "/")).getTime())/(24*60*60*1000)) : 0} 天
                                        </span>

                                    <span style={{marginLeft:'20px'}}>
                                            {(() => {
                                                if(q.time != '-'){
                                                    let num = ((new Date().getTime() - new Date(q.time).getTime())/(24*60*60*1000)).toFixed(1);
                                                    if(num < 1) return '最近修改 ：' + '今天';
                                                    if(num >= 1)return '最近修改 ：' + Math.ceil(num) + '天前';
                                                }else{
                                                    return '最近修改 ：无';
                                                }
                                            })()}
                                        </span>

                                </div>
                                <div className="gl-m-leftcontent">
                                    {
                                        q.strageties.map((s, i) => {
                                                let icontype = 'check',text = '运行中';
                                                switch(s.stra_status){
                                                    case 'running': icontype = 'check'; text = '运行'; break;
                                                    case 'new': icontype = 'bulb'; text = '新建'; break;
                                                    case 'stopped':  icontype = 'coffee'; text = '停止';break;
                                                }
                                                return (<div key={index + '-' + i} style={{padding:3}}>
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
                                                                    return '流量占比：' + ((s.stra_servers.length)*100/(q.slb_servers.length)).toFixed(1) + '%'
                                                                }
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <div className="right" style={{float:'left',width:'34%'}}>
                                                        <span><Icon className={'gl-icon-main gl-icon-main-'+icontype} type={icontype}/>{text}</span><br/>
                                                    </div>
                                                    <div className="clear"></div>
                                                </div>)
                                            }

                                        )
                                    }
                                </div>

                            </div>
                        </Card>
                        )}

                </div>

                <div className="card-container" style={{display: this.props.content.mainpage.card_container_display}}>


                  <Tabs type="card" onChange={this.tabChange.bind(this)} activeKey={ this.props.content.mainpage.main_card_key}>
                    <TabPane tab="流量" key="1">
                        <div className="topBox">
                            <div className="rangepickerBox">
                                <span>选择时间区间</span>
                                <RangePicker
                                  defaultValue={this.props.content.mainpage.rangeDefaultVal}
                                  format={dateFormat}
                                  onChange={this.rangeOnChange.bind(this)}
                                  disabledDate={this.disabledDate.bind(this)}
                                />
                            </div>
                            <div className="clear"></div>
                        </div>
                        <Traffic {...this.props}/>
                    </TabPane>

                    <TabPane tab="转化率" key="2">
                        <div id = "content_one" style={{display:this.props.content.mainpage.content_one_display}}>
                            <Conversion {...this.props}/>
                        </div>

                        <div id="content_two" className="back" style={{display: this.props.content.mainpage.content_two_display}}>
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
