import React from 'react';
import echarts from 'echarts';
import {Table,Button,Icon} from 'antd';
import moment from 'moment';
import request from '../../request';

//DatePicker
import { DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
import { Cascader } from 'antd';


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
        this.props.contentActions.mainpageActions.changeDatePicker(dateStrings);
    }
    onChange(arr){
        console.log(arr)
        this.props.contentActions.mainpageActions.changeCascader(arr);
    }
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }
    randerChart = async (date_picker, stragety_str) => {
        let startTime = moment(new Date(date_picker[0])).format('YYYY-MM-DD');
        let endTime = moment(new Date(date_picker[1])).format('YYYY-MM-DD');
        let str_arr = '["' + stragety_str + '"]'
        let res = await request.getConversionDataByStragety(str_arr, startTime, endTime);
        let responseData = res.result.data;
        console.log(responseData);
        //策略
        let stragetyVal = stragety_str;
        //link
        let linkVal = this.props.content.mainpage.casVal || this.props.content.mainpage.options_two[0].value;

        let length;
        let legendDate = [];
        let seriesArr = [];
        let percentObj = {};

        let uvObj = {};
        let pvObj = {};
        let showObj = {};
        let clickObj = {};

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
        for(let link in responseData[stragetyVal]){
            percentObj[link] = [];
            uvObj[link] = [];
            pvObj[link] = [];
            showObj[link] = [];
            clickObj[link] = [];
            tableData = [];
            responseData[stragetyVal][link].map((val,index) => {
                //echart
                percentObj[link].push((val.click_count*100/val.show_count).toFixed(2));
                uvObj[link].push(val.uv);
                pvObj[link].push(val.pv);
                showObj[link].push(val.show_count);
                clickObj[link].push(val.click_count);
                //table
                tableData.push({
                    key: index,
                    date: '3-2',
                    appear: val.show_count,
                    click: val.click_count,
                    persent: (val.click_count*100/val.show_count).toFixed(2),
                })
            })
        }

        tableData.forEach(function(v, index){
            v.date = xData[index]
        })
        this.setState({
            tableData: tableData
        })
        console.log(tableData)



        // 基于准备好的dom，初始化echarts实例

        // var data1 = [200, 130, 330, 450, 400, 250, 240, 500, 100, 600, 500, 250]
        // var data2 = [240, 150, 380, 400, 500, 260, 280, 550, 150, 500, 530, 250]
        // var data3 = [34, 25, 48, 50, 60, 36, 38, 65, 35, 60, 63, 35]

        var myChart = echarts.init(document.getElementById('duiji'));
        // 绘制图表
        myChart.setOption({
            title: { text: '' },
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
                data:['曝光','点击','点击率']
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
                    max: 2000000000,
                    interval: 200000000,
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
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name:'曝光',
                    type: "bar",
                    barWidth : 20,
                    stack: "总量",
                    data:showObj[linkVal]//[200, 130, 330]
                },
                {
                    name:'点击',
                    type: "bar",
                    barWidth : 20,
                    stack: "总量",
                    data:clickObj[linkVal]//[240, 150, 380]
                },
                {
                    name:'点击率',
                    type:'line',
                    yAxisIndex: 1,
                    data:percentObj[linkVal]//[34, 25, 48]
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
        let date_picker = nextProps.content.mainpage.date_picker;
        let stragety_str = nextProps.content.mainpage.content_two_key;
        this.randerChart(date_picker, stragety_str);
        return true;
    }
    render() {
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
                <div className="rangepickerBox">
                    <RangePicker
                        defaultValue={[moment().subtract(4, 'days'), moment()]}
                        format={'YYYY/MM/DD'}
                        onChange={this.rangeOnChange.bind(this)}
                        disabledDate={this.disabledDate.bind(this)}
                    />
                </div>
                <div className="CascaderBox">
                    <span>优化指标 ：</span>
                    <Cascader options={this.props.content.mainpage.options_two} defaultValue={[this.props.content.mainpage.options_two[0].value]} onChange={this.onChange.bind(this)} />
                </div>
                <div className="clear"></div>

                <div id="duiji" style={{width:'100%',height:400}} ></div>
                <Table bordered={true} columns={columns} dataSource={this.state.tableData} title={() => '按日期'}/>  
            </div>      
        )
    }
}