import React from 'react';

import echarts from 'echarts';
import MyTable from './table.js';
import { Table, Icon, Button,} from 'antd';
//var echarts = require('echarts');
import moment from 'moment';
import request from '../../request';
const postTableData  = require('./lib').postTableData;
const generateExcel  = require('./lib').generateExcel;

const HOST = require('../../../config').HOST;
const chart_url = HOST + '/charts/trafficData';


let tableColumns = [], tableData = [];

function inintdata(){
    tableColumns = [{
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: '10%',
    }, {
      title: 'UV',
      children: [],
      width: '25%',
    }, {
      title: 'PV',
      children: [],
      width: '25%',
    }];
};
inintdata();



export default class EChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: tableData,
            tableColumns: tableColumns
        }
    }
    randerChart = async (date_picker, stragety_arr) => {
        const _this = this;
        inintdata();
        let startTime = moment(new Date(date_picker[0])).format('YYYY-MM-DD');
        let endTime = moment(new Date(date_picker[1])).format('YYYY-MM-DD');
        let res = await request.getTrafficDataByStragety(stragety_arr, startTime, endTime);

        if(res.result.status == 'error'){
            return
        }
        let responseData = res.result.data;

        let uvArr = [];
        let pvArr = [];
        let legendDate = [];
        let seriesArr = [];
        
        

        if(responseData.length > 0){
            let strageties = Object.entries(responseData[0].uv);
            //循环生成变量
            strageties.map((v,i) => {
                uvArr[i] = [];
                pvArr[i] = []; 
            });

            //遍历生成 table 设置
            tableColumns[1].children = [];
            tableColumns[2].children = [];
            strageties.map((v,i) => {
                tableColumns[1].children.push({
                    title: v[1].name,
                    dataIndex: 'visitor' + (i+1),
                    key: 'visitor' + (i+1),
                });
                tableColumns[2].children.push({
                    title: v[1].name,
                    dataIndex: 'pv' + (i+1),
                    key: 'pv' + (i+1),
                });
            });

            let xData = function() {
                var start = new Date(date_picker[0]).getTime();
                var end = new Date(date_picker[1]).getTime();
                var length = (end - start)/(24*60*60*1000) + 1;

                var data_arr = [];
                var date = moment(new Date(date_picker[0]));
                for (var i = 0; i < length; i++) {
                    var month = date.month() + 1;
                    var day = date.date();
                    data_arr.push(month + "-" + day);

                    date = date.add(1, 'days');
                }
                //表格数据
                // tableData.forEach(function(v, index, arr_self){
                //     v.date = data_arr[index]
                // })
                return data_arr;
            }(date_picker);

            //循环赋值tableData
            tableData = [];
            responseData.map((val,index) => {
                tableData.push({
                    key: index + 1,
                    date: val.date,
                })
                let arr_uv = Object.entries(val.uv);
                arr_uv.map((v,i) => {
                    tableData[index]['visitor' + (i+1)] = v[1].pvuv;
                    tableData[index]['pv' + (i+1)] = v[1].pv;
                })
            });
            //循环赋值echart
            xData.forEach(function(xdate, index){
                strageties.map((v,i) => {
                    uvArr[i][index] = 0;
                    pvArr[i][index] = 0;
                });
                responseData.forEach(function(val){
                    //3-4 between 2017-3-4
                    let valDateStr = (new Date(val.date).getMonth() + 1) + '-' + new Date(val.date).getDate();
                    if(xdate == valDateStr){
                        let arr_uv = Object.entries(val.uv);
                        arr_uv.forEach(function(v,i){
                            uvArr[i][index] = v[1].pvuv;
                            pvArr[i][index] = v[1].pv;
                        })
                    }
                })
            })

            //遍历生成 echart 配置
            strageties.map((v,i) => {
                legendDate.push(v[1].name+' UV');
                legendDate.push(v[1].name+' PV');
                seriesArr.push({
                    name:v[1].name+' UV',
                    type:'bar',
                    barMaxWidth : 20,
                    data:uvArr[i],
                    itemStyle : {
                        normal: {
                            color: '#c23531',
                        }
                    },
                    barGap: '20%'
                });
                seriesArr.push({
                    name:v[1].name+' PV',
                    type:'bar',
                    barMaxWidth : 20,
                    data:pvArr[i],
                    itemStyle : {
                        normal: {
                            color: '#61a0a8',
                        }
                    },
                    barGap: '40%',
                })
            });

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('line'));
            // 绘制图表
            _this.setState({
                tableData: tableData,
                tableColumns: tableColumns
            })

            myChart.setOption({
                title: {
                    "text": "流量日统计表",
                    "subtext": "各版本单日页面访问量PV、UV趋势图",
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
                    data: legendDate,
                    bottom: 0,
                    right: 50
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xData,
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
                        },
                        nameLocation: 'start',
                        /*nameRotate: 15*/
                    }
                ],
                toolbox: {
                    show: true, //是否显示工具箱
                    feature: {
                        saveAsImage: { show: true },
                    },
                    top: 0,
                    right: 50
                },
                series: seriesArr
            });

        }else{
            console.log('所选日期无数据！');
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('line'));
            myChart.setOption({

                title: {
                    "text": "无数据",
                    "subtext": "",
                    "x": "center",
                    "y": "top",
                    "textStyle": {
                        "color": "#333",
                        "fontStyle": "normal",
                        "fontFamily": "fantasy",
                        "fontSize": 14
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '访问用户',
                        min: 0,
                        max: 2000,
                        interval: 200,
                        axisLabel: {
                            formatter: '{value}'
                        },
                    }
                ],
            });

            this.setState({
                tableData: [],
            })
        }
    }
    exportTable(){
        let date_picker = this.props.content.mainpage.date_picker;
        let stragety_arr = this.props.content.mainpage.strageties;
        let startTime = moment(new Date(date_picker[0])).format('YYYY-MM-DD');
        let endTime = moment(new Date(date_picker[1])).format('YYYY-MM-DD');
        let data = {};
        data.stragety_arr = stragety_arr;
        data.startTime = startTime;
        data.endTime = endTime;
        postTableData(chart_url, data,generateExcel);
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        let date_picker = nextProps.content.mainpage.date_picker;
        let stragety_arr = nextProps.content.mainpage.strageties;

        let tabsKey = nextProps.content.mainpage.main_card_key

        //组件展示出来后在请求数据
        if(nextProps.content.mainpage.card_container_display == 'block' && tabsKey == "1"){
            this.randerChart(date_picker, stragety_arr);
        }
        return true;
    }
    componentDidUpdate(prevProps, prevState){
        let stragety_arr = this.props.content.mainpage.strageties;
        if(prevProps.content.mainpage.strageties != stragety_arr && stragety_arr){
            this.props.contentActions.mainpageActions.setCascaderOptionstwo(stragety_arr);
        }
    }

    render() {
        return (
            <div style={{marginTop: 40}}>
                <div id="line" style={{width:'100%',height:400}} className="chart-box"></div>
                <div className="tableBox">
                    <Button className="export" onClick={this.exportTable.bind(this)}><Icon type="download" />导出表格</Button>
                    <Table bordered={true} size="middle" columns={this.state.tableColumns} dataSource={this.state.tableData} />
                </div>
            </div>          
        )
    }
}