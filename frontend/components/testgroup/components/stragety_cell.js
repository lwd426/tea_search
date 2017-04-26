import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import GLInfo from '../../deviceinfo/components/info'
import GLForm from './form'
import { Table, Input, Icon, Button,Modal, Popconfirm } from 'antd';
const confirm = Modal.confirm;

class GLAddStragety extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps =(nextProps)=> {
        return true;
    }
    goBack = () => {
        this.props.contentActions.testgroupActions.goback2stragelist()
    }
    render() {

        return (
            <div className="add-stragety">
                {/*<div className="gl-testinfo-btndiv">*/}
                    {/*<Button className="gl-left-btn" icon="double-left" onClick={this.goBack}>返回</Button>*/}
                {/*</div>*/}
                <div>
                    <div className="title">{this.props.content.testgroup.editting_status ? "修改分流策略" : "新增分流策略"}</div>
                </div>
                <GLForm {...this.props}/>

            </div>
        );
    }
}


export default GLAddStragety;
