import React from 'react';
import echarts from 'echarts';
import {Table,Button,Icon} from 'antd';
import moment from 'moment';

export default class EChart extends React.Component {
    randerChart = (date_picker) => {
        // 基于准备好的dom，初始化echarts实例

        var data1 = [20, 13, 33, 45, 40, 25, 24, 50, 10, 60, 50, 25]
        var data2 = [24, 15, 38, 40, 50, 26, 28, 55, 15, 50, 53, 25]
        var data3 = [34, 25, 48, 50, 60, 36, 38, 65, 35, 60, 63, 35]

        var myChart = echarts.init(document.getElementById('container'));
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

        console.log(xData);

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
                    data: xData,//['03-01','03-02','03-03','03-04','03-05','03-06','03-07','03-08','03-09','03-10','03-11','03-12'],
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
                    data:data1//[20, 13, 33, 45, 40, 25, 24, 50, 10, 60, 50, 25]
                },
                {
                    name:'版本二',
                    type:'line',
                    data:data2//[24, 15, 38, 40, 50, 26, 28, 55, 15, 50, 53, 25]
                },
                {
                    name:'原始版本',
                    type:'line',
                    data:data3//[34, 25, 48, 50, 60, 36, 38, 65, 35, 60, 63, 35]
                }
            ]
        });
    }

    componentDidMount() {
        let date_picker = this.props.content.mainpage.date_picker
        this.randerChart(date_picker);
    }
    componentWillReceiveProps(nextProps) {
        let date_picker = nextProps.content.mainpage.date_picker
        this.randerChart(date_picker);
        return true;
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
                <div className="tableBox">
                    <Button className="export">导出</Button>
                    <Table bordered={true} columns={columns} dataSource={data} title={() => '日均'}/> 
                </div>
            </div>      
        )
    }
}