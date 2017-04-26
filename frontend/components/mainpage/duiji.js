import React from 'react';
import echarts from 'echarts';
import {Table,Button,Icon} from 'antd';
import moment from 'moment';
import request from '../../request';

const HOST = require('../../../config').HOST;
const chart_url = HOST + '/charts/duijiData';
const postTableData  = require('./lib').postTableData;
const generateExcel  = require('./lib').generateExcel;
//DatePicker
import { DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
import { Cascader } from 'antd';
import * as lib from './lib';


let tableData = [{
  key: '1',
  date: '3-2',
  appear: 43,
  click: 22,
  persent: '20%',
}];


export default class EChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: tableData
        }
    }
    rangeOnChange(dates, dateStrings) {
        this.props.contentActions.mainpageActions.changeConversionDatePicker(dateStrings);
    }
    onChange(arr){
        console.log(arr)
        this.props.contentActions.mainpageActions.changeCascader(arr);
    }
    disabledDate(current) {
        return current && current.valueOf() > (Date.now() - 24*3600*1000);
    }
    randerChart = async (date_picker, stragety_str) => {
        let startTime = moment(new Date(date_picker[0])).format('YYYY-MM-DD');
        let endTime = moment(new Date(date_picker[1])).format('YYYY-MM-DD');
        let str_arr = '["' + stragety_str + '"]'
        let res = await request.getConversionDataByStragety(str_arr, startTime, endTime);
        let responseData = res.result.data;
        //策略
        let stragetyVal = stragety_str;
        //link
        let linkVal = this.props.content.mainpage.casVal || this.props.content.mainpage.options_two[0].value;

        let length;
        let legendDate = [];
        let seriesArr = [];
        let percentObj = [];

        let uvObj = [];
        let pvObj = [];
        let showObj = [];
        let clickObj = [];
        let dateObj = [];

        let strageties = Object.entries(responseData);
        let xData = function() {
            var start = new Date(date_picker[0]).getTime();
            var end = new Date(date_picker[1]).getTime();
            //var str = end.from(start, true); 
            length = (end - start)/(24*60*60*1000) + 1;
            var data_arr = [];
            var date = moment(new Date(date_picker[0]));
            for (var i = 0; i < length; i++) {
                var month = date.month() + 1;
                var day = date.date();
                data_arr.push(month + "-" + day);
                date = date.add(1, 'days');
            }
            return data_arr;
        }(date_picker);

        //循环赋值

        //循环赋值echart
        xData.forEach(function(xdate, index){
            percentObj[index] = 0;
            uvObj[index] = 0;
            pvObj[index] = 0;
            showObj[index] = 0;
            clickObj[index] = 0;
            dateObj[index] = 0;

            responseData[stragetyVal][linkVal].map((val) => {
                //3-4 between 2017-3-4
                let valDateStr = (new Date(val.date).getMonth() + 1) + '-' + new Date(val.date).getDate();
                if(xdate == valDateStr){
                   percentObj[index] = (val.click_count*100/val.show_count).toFixed(2);
                   uvObj[index] = val.uv;
                   pvObj[index] = val.pv;
                   showObj[index] = val.show_count;
                   clickObj[index] = val.click_count;
                   dateObj[index] = val.date;
                }
            })
        })
        //循环赋值 tableData
        tableData = [];
        responseData[stragetyVal][linkVal].map((val,index) => {
            tableData.push({
                key: index,
                date: val.date,
                appear: val.show_count,
                click: val.click_count,
                persent: (val.click_count*100/val.show_count).toFixed(2) + '%',
            })
        })

        this.setState({
            tableData: tableData
        })

        var myChart = echarts.init(document.getElementById('duiji'));
        // 绘制图表
        myChart.setOption({
            title: { "text": "点击率日统计表",
                "subtext": "单版本点击曝光量堆叠图",
                "x": "center",
                "y": "top",
                "textStyle": {
                    "color": "#333",
                    "fontStyle": "normal",
                    "fontFamily": "fantasy",
                    "fontSize": 14
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
                legend: {
                    data:['曝光','点击','点击率'],
                    bottom: 0,
                    right: 50,
                },
            xAxis: [
                {
                    type: 'category',
                    data: xData,//['03-01','03-02','03-03'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '访问用户',
                    min: 0,
                    max: 2000,
                    interval: 200,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '点击率',
                    min: 0,
                    max: 100,
                    interval: 10,
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
            ],
            toolbox: {
                show: true, //是否显示工具箱
                feature: {
                    saveAsImage: { show: true }
                },
                right: 50
            },
            series: [
                {
                    name:'曝光',
                    type: "bar",
                    barWidth : 20,
                    stack: "总量",
                    data:showObj//[200, 130, 330]
                },
                {
                    name:'点击',
                    type: "bar",
                    barWidth : 20,
                    stack: "总量",
                    data:clickObj//[240, 150, 380]
                },
                {
                    name:'点击率',
                    type:'line',
                    yAxisIndex: 1,
                    data:percentObj//[34, 25, 48]
                }
            ]
        });
    }

    componentDidMount() {
        /*let date_picker = this.props.content.mainpage.date_picker
        this.randerChart(date_picker);*/
    }
    componentWillReceiveProps(nextProps) {
        console.log('duiji componentWillReceiveProps');
        let date_picker = nextProps.content.mainpage.conversion_date_picker;
        let stragety_str = nextProps.content.mainpage.content_two_key;
        let tabsKey = nextProps.content.mainpage.main_card_key;

        if(nextProps.content.mainpage.content_two_display == 'block' && tabsKey == "2"){
            this.randerChart(date_picker, stragety_str);
        }
        //this.randerChart(date_picker, stragety_str);
        return true;
    }
    exportTable(){
        let date_picker = this.props.content.mainpage.conversion_date_picker;
        let stragety_arr = this.props.content.mainpage.strageties;
        let startTime = moment(new Date(date_picker[0])).format('YYYY-MM-DD');
        let endTime = moment(new Date(date_picker[1])).format('YYYY-MM-DD');
        let casVal = this.props.content.mainpage.casVal || this.props.content.mainpage.options_two[0].value;
        let stragety_str = this.props.content.mainpage.content_two_key;

        let data = {};
        data.stragety_arr = stragety_arr;
        data.startTime = startTime;
        data.endTime = endTime;
        data.linkVal = casVal;
        data.stragety_str = stragety_str;

        postTableData(chart_url, data,generateExcel);

    }
    render() {
        let conversion_date_picker = this.props.content.mainpage.conversion_date_picker;
        let conver_date_moment_val = [moment(new Date(conversion_date_picker[0])), moment(new Date(conversion_date_picker[1]))];
        const columns = [{
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            width: '20%',
        }, {
          title: '曝光',
          dataIndex: 'appear',
          key: 'appear',
        }, {
          title: '点击',
          dataIndex: 'click',
          key: 'click',
        }, {
          title: '转化率',
          dataIndex: 'persent',
          key: 'persent',
        }];

        return (
            <div>
                <div className="topBox">
                    <Button  className="gl-left-btn" icon="double-left" onClick={() => {
                            this.props.contentActions.mainpageActions.changeContentDisplay('block','none');
                    }}>返回</Button>
                    <div className="rangepickerBox">
                        <span>请选择时间区间</span>
                        <RangePicker
                            defaultValue={this.props.content.mainpage.rangeDefaultVal}
                            value={conver_date_moment_val}
                            format={'YYYY/MM/DD'}
                            onChange={this.rangeOnChange.bind(this)}
                            disabledDate={this.disabledDate.bind(this)}
                        />
                    </div>
                    <div className="CascaderBox">
                        <span className="castitle">优化指标 ：</span>
                        <Cascader options={this.props.content.mainpage.options_two} defaultValue={[this.props.content.mainpage.options_two[0].value]} onChange={this.onChange.bind(this)} />
                    </div>
                    <div className="clear"></div>
                </div>
                <div id="duiji" style={{width:'100%',height:400}} ></div>
                <div className="tableBox">
                    <Button className="export" onClick={this.exportTable.bind(this)}><Icon type="download" />导出表格</Button>
                    <Table bordered={true} size="middle" columns={columns} dataSource={this.state.tableData}/>
                </div>
            </div>      
        )
    }
}