import React from 'react';

import echarts from 'echarts';
//var echarts = require('echarts');
import moment from 'moment';
import request from '../../request';

let res='traffic';

export default class EChart extends React.Component {

    randerChart = async (date_picker) => {


        let startTime = moment(new Date(date_picker[0])).format('YYYY-MM-DD');
        let endTime = moment(new Date(date_picker[1])).format('YYYY-MM-DD');
        res = await request.getTrafficDataByStragety([100001],startTime,endTime);
        let data = res.result.data.reverse();
        console.log(data);

        let dataArr = [];
        let percentArr = [];
        let legendDate = ['总量'];
        let seriesArr = [];
        

        let a = [],b = [];

        let strageties = Object.entries(data[0].uv);
        strageties.map((v,i) => {
            dataArr[i] = [];
            percentArr[i] = [];
        });

        let dataAll = [];
        data.map((val,index) => {
            dataAll.push(val.uv_all);

            let arr_uv = Object.entries(val.uv)
            arr_uv.map((v,i) => {
                dataArr[i].push(v[1])
                percentArr[i].push(v[1]*100/val.uv_all);
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

            //data1 = data1.slice(0, length);
            // data2 = data2.slice(0, length);
            // data3 = data3.slice(0, length);
            // data4 = data4.slice(0, length);
            // data5 = data5.slice(0, length);

            //暂时切割长度，后期接口参数功能正常后，去掉
            dataAll = dataAll.slice(0, length)
            dataArr.map((v,i) => {
                a[i] = v.slice(0, length);
            });
            percentArr.map((v,i) => {
                b[i] = v.slice(0, length);
            })
            //遍历生成配置
            seriesArr = [{
                    name:'总量',
                    type:'bar',
                    barMaxWidth : 20,
                    data:dataAll
                }];
            strageties.map((v,i) => {
                legendDate.push('版本'+v[1]+'访问用户');
                seriesArr.push({
                        name:'版本'+v[1]+'访问用户',
                        type:'bar',
                        barMaxWidth : 20,
                        data:a[i]
                    })
            });
            strageties.map((v,i) => {
                legendDate.push('版本'+v[1]+'访问用户比例');
                seriesArr.push({
                    name:'版本'+v[1]+'访问用户比例',
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
                data: legendDate
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
                    saveAsImage: { show: true }
                }
            },
            series: seriesArr
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