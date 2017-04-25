import React from 'react';
import echarts from 'echarts';
import {Table,Button,Icon} from 'antd';
import moment from 'moment';
import request from '../../request';

const HOST = require('../../../config').HOST;
const chart_url = HOST + '/charts/conversionData';

//DatePicker
import { DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
import { Cascader } from 'antd';
import * as lib from './lib';

let tableData = [{
  key: '1',
  trtagetyName: '原始版本',
  uv: 3000,
  pv: 500,
  show: 43,
  click: 22,
  persent: '20%',
}];

//判断浏览器类型
function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) { return "Opera" }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) { return "FF"; } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){ return "Chrome"; }
    if (userAgent.indexOf("Safari") > -1) { return "Safari"; } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { return "IE"; }; //判断是否IE浏览器
    if (userAgent.indexOf("Trident") > -1) { return "Edge"; } //判断是否Edge浏览器
}
function SaveAs5(imgURL) {
    var oPop = window.open(imgURL,"","width=1, height=1, top=5000, left=5000");
    for(; oPop.document.readyState != "complete"; ) {
        if (oPop.document.readyState == "complete")break;
    }
    oPop.document.execCommand("SaveAs");
    oPop.close();
}


export default class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: tableData
        }
    }
    rangeOnChange(dates, dateStrings) {
        this.props.contentActions.mainpageActions.changeConversionDatePicker(dateStrings);
    }
    onChange(arr){
        console.log(arr)
        this.props.contentActions.mainpageActions.changeCascader(arr);
    }
    disabledDate(current) {
        return current && current.valueOf() > (Date.now() - 24*3600*1000);
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
        let percentNumObj = {}

        let uvObj = {};
        let pvObj = {};
        let showObj = {};
        let clickObj = {};
        let trtagetyNameObj = {}

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
            percentNumObj[key] = [];
            uvObj[key] = [];
            pvObj[key] = [];
            showObj[key] = [];
            clickObj[key] = [];
            trtagetyNameObj[key] = []

            for(let k in responseData[key]){
                percentObj[key][k] = [];
                percentNumObj[key][k] = [];
                uvObj[key][k] = [];
                pvObj[key][k] = [];
                showObj[key][k] = [];
                clickObj[key][k] = [];

                responseData[key][k].map((val,index) => {
                    //percentObj[key][k].push((val.click_count*100/val.show_count).toFixed(2));
                    percentNumObj[key][k].push(val.click_count*100/val.show_count);
                    uvObj[key][k].push(val.uv);
                    pvObj[key][k].push(val.pv);
                    showObj[key][k].push(val.show_count);
                    clickObj[key][k].push(val.click_count);
                    trtagetyNameObj[key] = val.name;
                })

                //echart选择范围大而没数据时则补0 (只对图表的 percent 做补0，图表还是按有数据的日期来求平均值)
                xData.forEach(function(xdate, index){
                    percentObj[key][k][index] = 0;
                    responseData[key][k].map((val) => {
                        //3-4 between 2017-3-4
                        let valDateStr = (new Date(val.date).getMonth() + 1) + '-' + new Date(val.date).getDate();
                        if(xdate == valDateStr){
                           percentObj[key][k][index] = (val.click_count*100/val.show_count).toFixed(2);

                        }
                    })
                })
            }
        }



        let casVal = this.props.content.mainpage.casVal || this.props.content.mainpage.options_two[0].value;

        strageties.map((v,i) => {
            legendDate.push(trtagetyNameObj[v[0]]);
            seriesArr.push({
                name:trtagetyNameObj[v[0]],
                type:'line',
                barMaxWidth : 20,
                data:percentObj[v[0]][casVal],
            });
        });

        var myChart = echarts.init(document.getElementById('container'));
        // 绘制图表
        myChart.setOption({
            title: {"text": "流量统计表",
                "subtext": "反馈总量趋势图和各类型反馈堆叠图",
                "x": "center",
                "y": "top",
                "textStyle": {
                    "color": "#333",
                    "fontStyle": "normal",
                    "fontFamily": "fantasy",
                    "fontSize": 14
                } },
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
                trtagetyName: trtagetyNameObj[v[0]],
                uv: Math.round(getAverageNumArr(uvObj[v[0]][casVal])),
                pv: Math.round(getAverageNumArr(pvObj[v[0]][casVal])),
                show: Math.round(getAverageNumArr(showObj[v[0]][casVal])),
                click: Math.round(getAverageNumArr(clickObj[v[0]][casVal])),
                persent: (getAverageNumArr(percentNumObj[v[0]][casVal])).toFixed(2) + '%',
            })
        })
        console.log(tableData)
        this.setState({
            tableData: tableData
        })
    }

    componentDidMount() {
        let date_picker = this.props.content.mainpage.conversion_date_picker;
        let stragety_arr = this.props.content.mainpage.strageties;
        this.randerChart(date_picker, stragety_arr);
    }
    componentWillReceiveProps(nextProps) {
        console.log('chart componentWillReceiveProps');
        let date_picker = nextProps.content.mainpage.conversion_date_picker;
        let stragety_arr = nextProps.content.mainpage.strageties;

        let tabsKey = nextProps.content.mainpage.main_card_key


        if(nextProps.content.mainpage.content_one_display == 'block' && tabsKey == "2"){
            this.randerChart(date_picker, stragety_arr);
        }

        return true;
    }
    async exportTable(){
        let date_picker = this.props.content.mainpage.conversion_date_picker;
        let stragety_arr = this.props.content.mainpage.strageties;
        let startTime = moment(new Date(date_picker[0])).format('YYYY-MM-DD');
        let endTime = moment(new Date(date_picker[1])).format('YYYY-MM-DD');
        let casVal = this.props.content.mainpage.casVal || this.props.content.mainpage.options_two[0].value;
        console.log(stragety_arr + startTime + endTime)
        // let res = await request.getTrafficDataByStragety(stragety_arr, startTime, endTime);

        let data = {};
        data.stragety_arr = stragety_arr;
        data.startTime = startTime;
        data.endTime = endTime;
        data.linkVal = casVal;


        let res = await lib.postTableData(chart_url, data);
        console.log(res);
        myBrowser();
        if (myBrowser()==="IE"||myBrowser()==="Edge"){ //IE
            odownLoad.href="#";
            var oImg=document.createElement("img");
            oImg.src=res;
            oImg.id="downImg";
            var odown=document.getElementById("down");
            odown.appendChild(oImg);
            SaveAs5(document.getElementById('downImg').src)
        }else{ //!IE
            var elemIF = document.createElement("iframe");
            elemIF.src = res;
            elemIF.style.display = "none";
            elemIF.href=res;
            elemIF.download="";
            document.body.appendChild(elemIF);

        }
    }
    render() {
        // (async() => {
        //     res = await request.getConversionDataByStragety("['100001', '100002']",'2017-03-05','2017-03-08');
        //     console.log(res.result.data);
        // })()
        let conversion_date_picker = this.props.content.mainpage.conversion_date_picker;
        let conver_date_moment_val = [moment(new Date(conversion_date_picker[0])), moment(new Date(conversion_date_picker[1]))];
        let tableColumns = [{
          title: '版本',
          dataIndex: 'trtagetyName',
          key: 'trtagetyName',
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

                <div className="rangepickerBox">
                    <span>请选择时间区间</span>
                    <RangePicker
                        defaultValue={this.props.content.mainpage.rangeDefaultVal}
                        value={conver_date_moment_val}
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
                    <Button className="export" onClick={this.exportTable.bind(this)}><Icon type="download" />导出表格</Button>
                    <Table bordered={true} size="middle" columns={tableColumns} dataSource={this.state.tableData} title={() => '日均'}/>

                </div>
            </div>      
        )
    }
}