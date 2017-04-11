import React from 'react';
import echarts from 'echarts';
import {Table,Button,Icon} from 'antd';

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
                data:['版本一','版本二','原始版本']
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
                    name: '转化率',
                    min: 10,
                    max: 70,
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
                    name:'版本一',
                    type:'line',
                    data:[20, 13, 33, 45, 40, 25, 24, 50, 10, 60, 50, 25]
                },
                {
                    name:'版本二',
                    type:'line',
                    data:[24, 15, 38, 40, 50, 26, 28, 55, 15, 50, 53, 25]
                },
                {
                    name:'原始版本',
                    type:'line',
                    data:[34, 25, 48, 50, 60, 36, 38, 65, 35, 60, 63, 35]
                }
            ]
        });
    }

    componentDidMount() {
        this.randerChart();
    }
    render() {
        const columns = [{
          title: '版本',
          dataIndex: 'date',
          key: 'date',
          width: '20%',
          render: (text, record, index) => (
            <a href="#" onClick={() => {
                this.props.contentActions.mainpageActions.changeContentDisplay('none','block',record.key);
            }}>
                {text}
            </a>
          )
        }, {
          title: 'UV 访客数',
          dataIndex: 'useramount',
          key: 'useramount',
          width: '20%',
        }, {
          title: 'PV 浏览数',
          dataIndex: 'visitor',
          key: 'visitor',
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


        const data = [{
          key: '1',
          date: '原始版本',
          useramount: 3000,
          visitor: 500,
          appear: 43,
          click: 22,
          persent: '20%',
        }, {
          key: '2',
          date: '测试版本一',
          useramount: 3000,
          visitor: 500,
          appear: 46,
          click: 28,
          persent: '20%',
        }, {
          key: '3',
          date: '测试版本二',
          useramount: 3000,
          visitor: 500,
          appear: 83,
          click: 62,
          persent: '20%',
        }];

        return (
            <div>
                <br />

                <div id="container" style={{width:'100%',height:400}} className="chart-box"></div>
                <Table bordered={true} columns={columns} dataSource={data} />  
            </div>      
        )
    }
}