import React, { Component, PropTypes } from 'react';
import './style.css';
import 'antd.min.css';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import Chart from './chart.js';
import EChart from './echart.js';

class GLMainpage extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                我是首页
                <Chart/>
                <EChart/>
            </div>
        );
    }
}


export default GLMainpage;
