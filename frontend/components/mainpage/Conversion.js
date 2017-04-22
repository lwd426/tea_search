import React from 'react';
import echarts from 'echarts';
import {Table,Button,Icon} from 'antd';
import moment from 'moment';
import request from '../../request';

//DatePicker
import { DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
import { Cascader } from 'antd';

let tableData = [{
          key: '1',
          date: '原始版本',
          uv: 3000,
          pv: 500,
          show: 43,
          click: 22,
          persent: '20%',
        }];

export default class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: tableData
        }
    }
    rangeOnChange(dates, dateStrings) {
        this.props.contentActions.mainpageActions.changeDatePicker(dateStrings);
    }
    onChange(arr){
        console.log(arr)
        this.props.contentActions.mainpageActions.changeCascader(arr);
    }
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }
    randerChart = async (date_picker, stragety_arr) => {

        let startTime = moment(new Date(date_picker[0])).format('YYYY-MM-DD');
        let endTime = moment(new Date(date_picker[1])).format('YYYY-MM-DD');
        let res = await request.getConversionDataByStragety(stragety_arr, startTime, endTime);
        let responseData = res.result.data;
        console.log(responseData);

        let length;
        let legendDate = [];
        let seriesArr = [];
        let percentObj = {};

        let uvObj = {};
        let pvObj = {};
        let showObj = {};
        let clickObj = {};

        let strageties = Object.entries(responseData);
        let xData = function() {
            var start = new Date(date_picker[0]).getTime();
            var end = new Date(date_picker[1]).getTime();
            //var str = end.from(start, true); 
            length = (end - start)/(24*60*60*1000) + 1;

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

        //循环赋值
        for(let key in responseData){
            percentObj[key] = [];
            uvObj[key] = [];
            pvObj[key] = [];
            showObj[key] = [];
            clickObj[key] = [];

            for(let k in responseData[key]){
                percentObj[key][k] = [];
                uvObj[key][k] = [];
                pvObj[key][k] = [];
                showObj[key][k] = [];
                clickObj[key][k] = [];

                responseData[key][k].map((val,index) => {
                    percentObj[key][k].push((val.click_count*100/val.show_count).toFixed(2));
                    uvObj[key][k].push(val.uv);
                    pvObj[key][k].push(val.pv);
                    showObj[key][k].push(val.show_count);
                    clickObj[key][k].push(val.click_count);
                })
            }
        }


        
        let casVal = this.props.content.mainpage.casVal || this.props.content.mainpage.options_two[0].value
        strageties.map((v,i) => {
            legendDate.push('版本 '+v[1].name);

            seriesArr.push({
                name:'版本 '+v[1].name,
                type:'line',
                barMaxWidth : 20,
                data:percentObj[v[0]][casVal],
            });

            console.log(percentObj[v[0]][casVal]);
        });

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
                data: legendDate//['版本一','版本二','原始版本']
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
            series: seriesArr,
        });

        //table
        function getAverageNumArr(arr){
            let sum = 0;
            let length = arr.length
            arr.map((v,i) => {
                sum += v;
            })
            let average = sum/length;
            return average
        }
        tableData = []
        strageties.map((v,i) => {
            tableData.push({
                key: v[0],
                date: '版本 '+v[1].name,
                uv: getAverageNumArr(uvObj[v[0]][casVal]),
                pv: getAverageNumArr(pvObj[v[0]][casVal]),
                show: getAverageNumArr(showObj[v[0]][casVal]),
                click: getAverageNumArr(clickObj[v[0]][casVal]),
                persent: getAverageNumArr(percentObj[v[0]][casVal]),
            })
        })
        this.setState({
            tableData: tableData
        })
    }

    componentDidMount() {
        let date_picker = this.props.content.mainpage.date_picker;
        let stragety_arr = this.props.content.mainpage.strageties;
        this.randerChart(date_picker, stragety_arr);
    }
    componentWillReceiveProps(nextProps) {
        console.log('chart componentWillReceiveProps');
        let date_picker = nextProps.content.mainpage.date_picker;
        let stragety_arr = nextProps.content.mainpage.strageties;

        let tabsKey = nextProps.content.mainpage.main_card_key


        if(nextProps.content.mainpage.content_one_display == 'block' && tabsKey == "2"){
            this.randerChart(date_picker, stragety_arr);
        }

        return true;
    }
    render() {
        // (async() => {
        //     res = await request.getConversionDataByStragety("['100001', '100002']",'2017-03-05','2017-03-08');
        //     console.log(res.result.data);
        // })()
        let tableColumns = [{
          title: '版本',
          dataIndex: 'date',
          key: 'date',
          width: '20%',
          render: (text, record, index) => (
            <a href="#" onClick={() => {
                console.log(record)
                this.props.contentActions.mainpageActions.changeContentDisplay('none','block',record.key);
            }}>
                {text}
            </a>
          )
        }, {
          title: 'UV 访客数',
          dataIndex: 'uv',
          key: 'uv',
          width: '20%',
        }, {
          title: 'PV 浏览数',
          dataIndex: 'pv',
          key: 'pv',
          width: '20%',
        }, {
          title: '曝光',
          dataIndex: 'show',
          key: 'show',
        }, {
          title: '点击',
          dataIndex: 'click',
          key: 'click',
        }, {
          title: '转化率',
          dataIndex: 'persent',
          key: 'persent',
        }];
        return (
            <div>
                <br />
                <div className="rangepickerBox">
                    <RangePicker
                        defaultValue={[moment().subtract(4, 'days'), moment()]}
                        format={'YYYY/MM/DD'}
                        onChange={this.rangeOnChange.bind(this)}
                        disabledDate={this.disabledDate.bind(this)}
                    />
                </div>
                <div className="CascaderBox">
                    <span>优化指标 ：</span>
                    <Cascader options={this.props.content.mainpage.options_two} defaultValue={[this.props.content.mainpage.options_two[0].value]} onChange={this.onChange.bind(this)} />
                </div>
                <div className="clear"></div>

                <div id="container" style={{width:'100%',height:400}} className="chart-box"></div>
                <div className="tableBox">
                    <Button className="export">导出</Button>
                    <Table bordered={true} columns={tableColumns} dataSource={this.state.tableData} title={() => '日均'}/> 
                </div>
            </div>      
        )
    }
}