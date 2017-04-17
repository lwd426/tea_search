import React from 'react';

import echarts from 'echarts';
import MyTable from './table.js';
import { Table, Icon } from 'antd';
//var echarts = require('echarts');
import moment from 'moment';
import request from '../../request';


let tableColumns = [], tableData = [];

function inintdata(){
    tableColumns = [{
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: '10%',
    }, {
      title: '用户总量',
      dataIndex: 'useramount',
      key: 'useramount',
      width: '10%',
    }, {
      title: '访客数',
      children: [],
      width: '25%',
    }, {
      title: '访问用户比例',
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
        console.log(responseData);

        let dataArr = [];
        let percentArr = [];
        let legendDate = ['总量'];
        let seriesArr = [];
        

        let a = [],b = [];

        let strageties = Object.entries(responseData[0].uv);

        //循环生成变量
        strageties.map((v,i) => {
            dataArr[i] = [];
            percentArr[i] = []; 
        });

        let dataAll = [];

        //遍历生成 table 设置
        strageties.map((v,i) => {
            tableColumns[2].children.push({
                title: '版本' + v[0],
                dataIndex: 'visitor' + (i+1),
                key: 'visitor' + (i+1),
            });
            tableColumns[3].children.push({
                title: '版本' + v[0],
                dataIndex: 'persent' + (i+1),
                key: 'persent' + (i+1),
            });
        })

        //循环赋值
        responseData.map((val,index) => {
            dataAll.push(val.uv_all);
            tableData.push({
                key: index + 1,
                date: '3-4',
                useramount: val.uv_all,
                // visitor1: 500,
                // visitor2: 500,
                // persent1: '20%',
                // persent2: '20%',
            })
            let arr_uv = Object.entries(val.uv);
            arr_uv.map((v,i) => {
                dataArr[i].push(v[1].count)
                percentArr[i].push((v[1].count*100/val.uv_all).toFixed(2));

                tableData[index]['visitor' + (i+1)] = v[1].count;
                tableData[index]['persent' + (i+1)] = (v[1].count*100/val.uv_all).toFixed(2);
            })
        })
        
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('line'));

        // 绘制图表
        let xData = function() {
            var start = new Date(date_picker[0]).getTime();
            var end = new Date(date_picker[1]).getTime();
            //var str = end.from(start, true); 
            var length = (end - start)/(24*60*60*1000) + 1;

            //暂时切割长度，后期接口参数功能正常后，去掉
            dataAll = dataAll.slice(0, length)
            dataArr.map((v,i) => {
                a[i] = v.slice(0, length);
            });
            percentArr.map((v,i) => {
                b[i] = v.slice(0, length);
            })
            //遍历生成 echart 配置
            seriesArr = [{
                    name:'总量',
                    type:'bar',
                    barMaxWidth : 20,
                    data:dataAll
                }];
            strageties.map((v,i) => {
                legendDate.push('版本'+v[0]+'访问用户');
                seriesArr.push({
                    name:'版本'+v[0]+'访问用户',
                    type:'bar',
                    barMaxWidth : 20,
                    data:a[i]
                })
            });
            strageties.map((v,i) => {
                legendDate.push('版本'+v[0]+'访问用户比例');
                seriesArr.push({
                    name:'版本'+v[0]+'访问用户比例',
                    type:'line',
                    yAxisIndex: 1,
                    data:b[i]
                })
            })

            var data_arr = [];
            var date = moment(new Date(date_picker[0]));
            for (var i = 0; i < length; i++) {
                var month = date.month() + 1;
                var day = date.date();
                data_arr.push(month + "-" + day);

                date = date.add(1, 'days');
            }

            //表格数据
            tableData = tableData.slice(0, length);
            tableData.forEach(function(v, index, arr_self){
                v.date = data_arr[index]
            })
            _this.setState({
                tableData: tableData,
                tableColumns: tableColumns
            })

            return data_arr;
        }(date_picker);

        //console.log(xData);

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
                top: 0
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
                    max: 1000000000,
                    interval: 100000000,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '访问用户比例',
                    min: 0,
                    max: 100,
                    interval: 10,
                    axisLabel: {
                        formatter: '{value} %'
                    }
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

    componentDidMount() {
        // let date_picker = this.props.content.mainpage.date_picker
        // console.log(date_picker);
        // this.randerChart(date_picker);
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
                    <Table bordered={true} columns={this.state.tableColumns} dataSource={this.state.tableData} /> 
                </div>
            </div>          
        )
    }
}