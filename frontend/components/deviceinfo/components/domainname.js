import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import { Form, Input, Tooltip, Icon, Button, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import contentactions from '../../actions';
import EditableCell from './editcell';

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            value: '',
        }
    }

    success = () => {
      message.success('Update success');
    }

    error = () => {
      message.error('This is a message of error');
    }
    change = (event) => {
        this.setState({
          value:event.target.value//注意事件对象
        });
    }
    updataSlb = () => {
        const objectID = this.props.menu.slbid;
        var slbDomain = this.refs.input.refs.input.value;
        //actions.updateMenu(name, domainid, objectID)
        this.props.contentActions.deviceinfoActions.updateSLB(objectID, slbDomain);
        this.success();
        this.refs.domainID.refs.input.value = '111';
    }
    componentWillReceiveProps(nextProps) {
        console.log('domain componentWillReceiveProps')
        return true;
    }
    componentDidMount = () => {
        const objectID = this.props.menu.slbid;
        this.props.contentActions.deviceinfoActions.getSLB(objectID);
    }
    render() {
        let name = this.props.content.deviceinfo.current_slb_name || '';
        var value=this.state.value;
        if(value == '' && name != '' ){
            value = name;
        }

        return (
            <div className="slbBox">
                <span className="labelspan">SLB域名 : </span>
                <Input ref="input" value={value} onChange={this.change}/>
                
                <br/><br/>
                <span className="labelspan">域名 ID : </span> 
                <Input ref="domainID" disabled={true} /> <br/><br/>
                <Button type="primary" size="large" onClick={this.updataSlb.bind(this)}>保存</Button>
                <Button type="primary" size="large">取消</Button>
            </div>
        );
    }
}
export default RegistrationForm;