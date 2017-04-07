import React from 'react';

import echarts from 'echarts';
//var echarts = require('echarts');



export default class EChart extends React.Component {

    randerChart = () => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('container'));
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
                data:['总量','版本一访问用户','版本二访问用户','版本一访问用户比例','版本二访问用户比例']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['03-01','03-02','03-03','03-04','03-05','03-06','03-07','03-08','03-09','03-10','03-11','03-12'],
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
                    data:[2000, 3000, 2700, 3000, 4000, 5000, 4000, 3500, 3000, 2000, 3000, 4000]
                },
                {
                    name:'版本一访问用户',
                    type:'bar',
                    data:[500, 590, 290, 300, 1000, 1200, 2000, 1000, 1500, 1200, 1500, 1000]
                },
                {
                    name:'版本二访问用户',
                    type:'bar',
                    data:[600, 690, 390, 500, 1200, 1500, 2200, 800, 1300, 1000, 1100, 1300]
                },
                {
                    name:'版本一访问用户比例',
                    type:'line',
                    yAxisIndex: 1,
                    data:[20, 13, 33, 45, 40, 25, 24, 50, 10, 60, 50, 25]
                },
                {
                    name:'版本二访问用户比例',
                    type:'line',
                    yAxisIndex: 1,
                    data:[24, 15, 38, 40, 50, 26, 28, 55, 15, 50, 53, 25]
                }
            ]
        });
    }

    componentDidMount() {
        this.randerChart();
    }

    render() {
        return (
            <div>
                <div id="container" style={{width:'100%',height:400}} className="chart-box"></div>
            </div>          
        )
    }
}