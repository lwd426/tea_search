 import React, { Component } from 'react'
import '../style.css';
import 'antd.min.css';
import { Form, Input, Tooltip, Icon, Button, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import contentactions from '../../actions';
import EditableCell from './editcell';
import request from '../../../request';

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            value: '',
            disabled: false,
        }
    }

    success = () => {
      message.success('Update success');
    }
    error = (mes) => {
      message.error( mes + '');
    }
    change = (event) => {
        this.setState({
          value:event.target.value//注意事件对象
        });
    }
    updataSlb = async () => {
        const objectID = this.props.menu.slbid;
        var slbDomain = this.refs.input.refs.input.value;
        if(slbDomain == ''){
            this.error('请输入域名！');
            return false
        }
        //actions.updateMenu(name, domainid, objectID)
        
        let res = await request.getVirtualHostByname(slbDomain);
        if(res.status == 'success'){
            let domainId = res.data[0]
            this.refs.domainID.refs.input.value = domainId;//domainID input 填入接口返回的id
            this.props.contentActions.deviceinfoActions.updateSLB(objectID, slbDomain, domainId);//更新到数据库
            this.success();
            this.setState({
                disabled: true
            })
        }else{
            this.error(res.data)
            //赋值为原始值
            let name = nextProps.content.deviceinfo.current_slb_name || '';
            this.setState({
              value: name
            });
        }
        
    }
    componentWillReceiveProps = async (nextProps) => {
        console.log('domain componentWillReceiveProps');
        let name = this.props.menu.domain || '';
        let {domain, domainId} = this.props.menu;

        //第一次进来，若数据库有值则给域名赋值
        // this.setState({
        //   value: name
        // });
        //若域名有值，同样给 domainid 赋值
        if(domain != '' && !domainId){
            let res = await request.getVirtualHostByname(name);
            if(res.status == 'success'){
                this.refs.domainID.refs.input.value = res.data[0];//domainID input 填入接口返回的id

            }
            this.setState({
                disabled: true
            })
        }

        return true;
    }
    componentDidMount = () => {
        // const objectID = this.props.menu.slbid;
        // this.props.contentActions.deviceinfoActions.getSLB(objectID);
    }
    render() {
        let value = this.state.value;
        return (
            <div className="slbBox">
                <span className="labelspan">SLB域名 : </span>
                <Input ref="input" value={this.props.menu.domain}  disabled={this.state.disabled} onChange={this.change}/>
                
                <br/><br/>
                <span className="labelspan">域名 ID : </span> 
                <Input ref="domainID" value={this.props.menu.domainId} disabled={true} /> <br/><br/>
                <Button type="primary" size="large" onClick={this.updataSlb.bind(this)}>保存</Button>
            </div>
        );
    }
}
export default RegistrationForm;