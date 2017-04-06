import React from 'react';

import echarts from 'echarts';
//var echarts = require('echarts');



export default class EChart extends React.Component {

    randerChart = () => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('container'));
        // 绘制图表
        myChart.setOption({
            title: { text: 'ECharts 入门示例' },
            tooltip: {},
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
    }

    componentDidMount() {
        this.randerChart();
    }

    render() {
        return (
            <div>
                <div id="container" style={{width:'100%',height:600,border:'5px solid #ccc'}} className="chart-box"></div>
            </div>          
        )
    }
}