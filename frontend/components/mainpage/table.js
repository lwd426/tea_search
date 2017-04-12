import React from 'react';
import { Table, Icon } from 'antd';
import moment from 'moment';

const columns = [{
  title: '日期',
  dataIndex: 'date',
  key: 'date',
  width: '10%',
}, {
  title: '用户总量',
  children: [{
    title: '版本一',
    dataIndex: 'useramount1',
    key: 'useramount1',
  }, {
    title: '版本二',
    dataIndex: 'useramount2',
    key: 'useramount2',
  }],
  width: '25%',
}, {
  title: '访客数',
  children: [{
    title: '版本一',
    dataIndex: 'visitor1',
    key: 'visitor1',
  }, {
    title: '版本二',
    dataIndex: 'visitor2',
    key: 'visitor2',
  }],
  width: '25%',
}, {
  title: '访问用户比例',
  children: [{
    title: '版本一',
    dataIndex: 'persent1',
    key: 'persent1',
  }, {
    title: '版本二',
    dataIndex: 'persent2',
    key: 'persent2',
  }],
  width: '25%',
}];



let data = [{
  key: '1',
  date: '3-2',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '2',
  date: '3-3',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '3',
  date: '3-4',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '4',
  date: '3-4',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '5',
  date: '3-4',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '6',
  date: '3-4',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '7',
  date: '3-4',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '8',
  date: '3-4',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '9',
  date: '3-4',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '10',
  date: '3-4',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '11',
  date: '3-4',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}, {
  key: '12',
  date: '3-4',
  useramount1: 3000,
  useramount2:3000,
  visitor1: 500,
  visitor2: 500,
  persent1: '20%',
  persent2: '20%',
}];

export default class EChart extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {

        let date_picker = nextProps.content.mainpage.date_picker
        console.log(date_picker);

        var start = new Date(date_picker[0]).getTime();
        var end = new Date(date_picker[1]).getTime();
        //var str = end.from(start, true); 
        var length = (end - start)/(24*60*60*1000) + 1;

        let xData = function() {
            var start = new Date(date_picker[0]).getTime();
            var end = new Date(date_picker[1]).getTime();
            //var str = end.from(start, true); 
            var length = (end - start)/(24*60*60*1000) + 1;


            var data_arr = [];
            var date = moment(new Date(date_picker[0]));
            for (var i = 0; i < length; i++) {
                var month = date.month() + 1;
                var day = date.date();
                data_arr.push(month + "-" + day);

                date = date.add(1, 'days');
            }

            data = data.slice(0, length);
            data.forEach(function(v, index, arr_self){
                v.date = data_arr[index]
            })


            return data_arr;
        }(date_picker);


        return true;
    }
    
    render() {
        return (
          <div className="tableBox">
            <Table bordered={true} columns={columns} dataSource={data} /> 
          </div>       
        )
    }
}