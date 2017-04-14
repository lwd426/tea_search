import React from 'react';

import echarts from 'echarts';
//var echarts = require('echarts');
import moment from 'moment';



export default class EChart extends React.Component {

    randerChart = (date_picker) => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('line'));
        var data1 = [2000, 3000, 2700, 3000, 4000, 5000, 4000, 3500, 3000, 2000, 3000, 4000];
        var data2 = [500, 590, 290, 300, 1000, 1200, 2000, 1000, 1500, 1200, 1500, 1000];
        var data3 = [600, 690, 390, 500, 1200, 1500, 2200, 800, 1300, 1000, 1100, 1300];
        var data4 = [20, 13, 33, 45, 40, 25, 24, 50, 10, 60, 50, 25];
        var data5 = [24, 15, 38, 40, 50, 26, 28, 55, 15, 50, 53, 25];

        // 绘制图表
        let xData = function() {
            var start = new Date(date_picker[0]).getTime();
            var end = new Date(date_picker[1]).getTime();
            //var str = end.from(start, true); 
            var length = (end - start)/(24*60*60*1000) + 1;

            data1 = data1.slice(0, length);
            data2 = data2.slice(0, length);
            data3 = data3.slice(0, length);
            data4 = data4.slice(0, length);
            data5 = data5.slice(0, length);

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
                data:['总量','版本一访问用户','版本二访问用户','版本一访问用户比例','版本二访问用户比例']
            },
            xAxis: [
                {
                    type: 'category',
                    data: xData,//['03-01','03-02','03-03','03-04','03-05','03-06','03-07','03-08','03-09','03-10','03-11','03-12'],
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
                    max: 6000,
                    interval: 1000,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '访问用户比例',
                    min: 0,
                    max: 60,
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
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name:'总量',
                    type:'bar',
                    barMaxWidth : 20,
                    data:data1//[2000, 3000, 2700, 3000, 4000, 5000, 4000, 3500, 3000, 2000, 3000, 4000]
                },
                {
                    name:'版本一访问用户',
                    type:'bar',
                    barMaxWidth : 20,
                    data:data2//[500, 590, 290, 300, 1000, 1200, 2000, 1000, 1500, 1200, 1500, 1000]
                },
                {
                    name:'版本二访问用户',
                    type:'bar',
                    barMaxWidth : 20,
                    data:data3//[600, 690, 390, 500, 1200, 1500, 2200, 800, 1300, 1000, 1100, 1300]
                },
                {
                    name:'版本一访问用户比例',
                    type:'line',
                    yAxisIndex: 1,
                    data:data4//[20, 13, 33, 45, 40, 25, 24, 50, 10, 60, 50, 25]
                },
                {
                    name:'版本二访问用户比例',
                    type:'line',
                    yAxisIndex: 1,
                    data:data5//[24, 15, 38, 40, 50, 26, 28, 55, 15, 50, 53, 25]
                }
            ]
        });
    }

    componentDidMount() {
        let date_picker = this.props.content.mainpage.date_picker
        console.log(date_picker);
        this.randerChart(date_picker);
    }
    componentWillReceiveProps(nextProps) {
        console.log('echart componentWillReceiveProps');
        let date_picker = nextProps.content.mainpage.date_picker
        //console.log(date_picker);//然后根据 stragety + rangpicker 请求策略数据，然后 renderChart出来
        this.randerChart(date_picker);
        return true;
    }

    render() {
        return (
            <div>
                <div id="line" style={{width:'100%',height:400}} className="chart-box"></div>
            </div>          
        )
    }
}