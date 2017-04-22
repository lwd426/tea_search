import React from 'react';

import echarts from 'echarts';
import MyTable from './table.js';
import { Table, Icon, Button,} from 'antd';
//var echarts = require('echarts');
import moment from 'moment';
import request from '../../request';
import * as lib from './lib';


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
        let responseData = res.result.data.reverse();

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
            strageties.map((v,i) => {
                tableColumns[1].children.push({
                    title: '版本' + v[0],
                    dataIndex: 'visitor' + (i+1),
                    key: 'visitor' + (i+1),
                });
                tableColumns[2].children.push({
                    title: '版本' + v[0],
                    dataIndex: 'persent' + (i+1),
                    key: 'persent' + (i+1),
                });
            });

            //循环赋值
            tableData = [];
            responseData.map((val,index) => {
                tableData.push({
                    key: index + 1,
                    date: '3-4',
                    //useramount: val.uv_all,
                    // visitor1: 500,
                    // visitor2: 500,
                    // persent1: '20%',
                    // persent2: '20%',
                })
                let arr_uv = Object.entries(val.uv);
                arr_uv.map((v,i) => {
                    uvArr[i].push(v[1].pvuv)
                    pvArr[i].push(v[1].pv);

                    tableData[index]['visitor' + (i+1)] = v[1].pvuv;
                    tableData[index]['persent' + (i+1)] = v[1].pv;
                })
            });

            //遍历生成 echart 配置
            strageties.map((v,i) => {
                legendDate.push('版本'+v[0]+'UV');
                seriesArr.push({
                    name:'版本'+v[0]+'UV',
                    type:'bar',
                    barMaxWidth : 20,
                    data:uvArr[i]
                })
            });
            strageties.map((v,i) => {
                legendDate.push('版本'+v[0]+'PV');
                seriesArr.push({
                    name:'版本'+v[0]+'PV',
                    type:'bar',
                    barMaxWidth : 20,
                    data:pvArr[i]
                })
            })

        }else{
            alert('所选日期五数据！')
        }


        

        
        
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('line'));
        // 绘制图表
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
            tableData.forEach(function(v, index, arr_self){
                v.date = data_arr[index]
            })
            console.log(tableData)
            _this.setState({
                tableData: tableData,
                tableColumns: tableColumns
            })

            return data_arr;
        }(date_picker);

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
                data: legendDate,
                top: 0,
                formatter: function (name) {
                    return echarts.format.truncateText(name, 150, '14px Microsoft Yahei', '…');
                },
                tooltip: {
                    show: true
                },
                height: 50
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
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                    restore: { show: true },
                    saveAsImage: { show: true },
                },
                bottom: 0,
                right: 50
            },
            series: seriesArr
        });
    }
    async exportTable(){
        let date_picker = this.props.content.mainpage.date_picker;
        let stragety_arr = this.props.content.mainpage.strageties;
        let startTime = moment(new Date(date_picker[0])).format('YYYY-MM-DD');
        let endTime = moment(new Date(date_picker[1])).format('YYYY-MM-DD');
        console.log(stragety_arr + startTime + endTime)
        //let res = await request.getTrafficDataByStragety(stragety_arr, startTime, endTime);

        let data = {};
        data.stragety_arr = stragety_arr;
        data.startTime = startTime;
        data.endTime = endTime;
        let res = await lib.postTableData(data);
        console.log(res);
    }
    componentDidMount() {
        // let date_picker = this.props.content.mainpage.date_picker
        // console.log(date_picker);
        // this.randerChart(date_picker);
        this.props.contentActions.mainpageActions.setCascaderOptionstow();
    }
    componentWillReceiveProps(nextProps) {
        console.log('echart componentWillReceiveProps');
        let date_picker = nextProps.content.mainpage.date_picker;
        let stragety_arr = nextProps.content.mainpage.strageties;

        let tabsKey = nextProps.content.mainpage.main_card_key

        //组件展示出来后在请求数据
        if(nextProps.content.mainpage.card_container_display == 'block' && tabsKey == "1"){
            this.randerChart(date_picker, stragety_arr);
        }
        return true;
    }

    render() {
        return (
            <div>
                <div id="line" style={{width:'100%',height:400}} className="chart-box"></div>
                <div className="tableBox">
                    <Button className="export" onClick={this.exportTable.bind(this)}><Icon type="download" />导出表格</Button>
                    <Table bordered={true} columns={this.state.tableColumns} dataSource={this.state.tableData} /> 
                </div>
            </div>          
        )
    }
}