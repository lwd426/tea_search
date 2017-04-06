import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import { Form, Input, Tooltip, Icon, Button, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import contentactions from '../../actions'

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
        }
    }

    success = () => {
      message.success('Update success');
    }

    error = () => {
      message.error('This is a message of error');
    }
    
    updataSlb = () => {
        var objectID = 'I4WN52Sb7j';
        var slbDomain = 'houge.com';
        //actions.updateMenu(name, domainid, objectID)
        this.props.contentActions.deviceinfoActions.updateSLB(objectID, slbDomain);
        /*var inputDOM = this.refs['input'].getDOMNode();
        inputDOM.value = 'ddd'*/
        this.success()
    }
    render() {
        return (
            <div className="slbBox">
                <span className="labelspan">SLB域名 : </span> <Input /> <br/><br/>
                <span className="labelspan">域名 ID : </span> <Input disabled={true} ref="input"/> <br/><br/>
                <Button type="primary" size="large" onClick={this.updataSlb.bind(this)}>保存</Button>
                <Button type="primary" size="large">取消</Button>
            </div>
        );
    }
}
export default RegistrationForm;