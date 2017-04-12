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
    updataSlb = async() => {
        const objectID = this.props.menu.slbid;
        var slbDomain = this.refs.input.refs.input.value;
        //actions.updateMenu(name, domainid, objectID)
        this.props.contentActions.deviceinfoActions.updateSLB(objectID, slbDomain);
        this.success();
        //await this.props.contentActions.deviceinfoActions.checkoutSLB(slbDomain);
        /*fetch('http://10.118.31.22:8081' + '/v2/virtualhost/getbyname/' + slbDomain,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "SlbAccount": "le-test"
            }
        }).then((res) => {
            return res.json()
        })


        try {
          let response = await fetch('http://10.118.31.22:8081' + '/v2/virtualhost/getbyname/' + slbDomain);
          let data = response.json();
          console.log(data);
        } catch(e) {
          console.log("error", e);
        }*/
        // 注：这段代码如果想运行，外面需要包一个 async function

        this.refs.domainID.refs.input.value = '111';//到时拿到接口后，填入接口返回的id
    }
    componentWillReceiveProps(nextProps) {
        console.log('domain componentWillReceiveProps');
        let name = nextProps.content.deviceinfo.current_slb_name || '';
        this.setState({
          value: name
        });
        return true;
    }
    componentDidMount = () => {
        const objectID = this.props.menu.slbid;
        this.props.contentActions.deviceinfoActions.getSLB(objectID);
    }
    render() {
        let value = this.state.value;

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