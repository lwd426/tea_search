import React from 'react';
import echarts from 'echarts';
import {Table,Button,Icon} from 'antd';
import moment from 'moment';

export default class EChart extends React.Component {
    randerChart = (date_picker) => {
        // 基于准备好的dom，初始化echarts实例

        var data1 = [200, 130, 330, 450, 400, 250, 240, 500, 100, 600, 500, 250]
        var data2 = [240, 150, 380, 400, 500, 260, 280, 550, 150, 500, 530, 250]
        var data3 = [34, 25, 48, 50, 60, 36, 38, 65, 35, 60, 63, 35]

        var myChart = echarts.init(document.getElementById('duiji'));
        // 绘制图表
        let xData = function() {
            var start = new Date(date_picker[0]).getTime();
            var end = new Date(date_picker[1]).getTime();
            //var str = end.from(start, true); 
            var length = (end - start)/(24*60*60*1000) + 1;

            data1 = data1.slice(0, length);
            data2 = data2.slice(0, length);
            data3 = data3.slice(0, length);

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
                    max: 1500,
                    interval: 300,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '点击率',
                    min: 0,
                    max: 100,
                    interval: 20,
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
                    data:data1//[200, 130, 330, 450, 400, 250, 240, 500, 100, 600, 500, 250]
                },
                {
                    name:'点击',
                    type: "bar",
                    barWidth : 20,
                    stack: "总量",
                    data:data2//[240, 150, 380, 400, 500, 260, 280, 550, 150, 500, 530, 250]
                },
                {
                    name:'点击率',
                    type:'line',
                    yAxisIndex: 1,
                    data:data3//[34, 25, 48, 50, 60, 36, 38, 65, 35, 60, 63, 35]
                }
            ]
        });
    }

    componentDidMount() {
        /*let date_picker = this.props.content.mainpage.date_picker
        this.randerChart(date_picker);*/
    }
    componentWillReceiveProps(nextProps) {
        let date_picker = nextProps.content.mainpage.date_picker
        this.randerChart(date_picker);
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


        const data = [{
          key: '1',
          date: '3-2',
          appear: 43,
          click: 22,
          persent: '20%',
        }, {
          key: '2',
          date: '3-3',
          appear: 46,
          click: 28,
          persent: '20%',
        }, {
          key: '3',
          date: '3-4',
          appear: 83,
          click: 62,
          persent: '20%',
        }];

        return (
            <div>
                <div id="duiji" style={{width:'100%',height:400}} ></div>
                <Table bordered={true} columns={columns} dataSource={data} title={() => '按日期'}/>  
            </div>      
        )
    }
}