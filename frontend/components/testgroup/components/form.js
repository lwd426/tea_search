import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import GLServerTree from './servertree'
import { Form, Input,DatePicker, Tooltip,Icon,Radio, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { RangePicker } = DatePicker;

const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
}];

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                var name = values.stra_name;
                var desc = values.stra_desc || '';
                var cities = values.stra_cities || [];
                var servers = _this.props.content.testgroup.serverselected;
                var urls = _this.props.content.testgroup.addurls;
                var uids = _this.props.content.testgroup.adduids;
                const slbid = _this.props.menu.slbid || '';
                const tgid = _this.props.content.testgroup.tgid || '';
                this.props.contentActions.testgroupActions.validate(slbid,tgid,name,desc,cities,servers,urls,uids)
            }
        });
    }
    componentWillMount =()=> {
        this.props.contentActions.testgroupActions.getCities();
        const slbid = this.props.menu.slbid || '';
        this.props.contentActions.testgroupActions.getServers(slbid);
    }
    componentWillReceiveProps =(nextProps)=> {
        return true;
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    changeAddUrlType = (e) => {
        var type = e.target.value;
        this.props.contentActions.testgroupActions.changeAddUrlType(type)
    }
    changeAddUidType = (e) => {
        var type = e.target.value;
        this.props.contentActions.testgroupActions.changeAddUidType(type)
    }
    addUrl = () => {
        var type = this.props.content.testgroup.addurltype;
        var refname = '',values=[];
        if(type === "single"){
            refname = 'urlinputsingle'
        }else{
            refname = 'urlinputmultiple'
        }
        var value = this.refs[refname].refs.input.value;
        if(value.indexOf(';') !== -1){
            values = value.split(';');
        }else{
            values.push(value)

        }
        this.props.contentActions.testgroupActions.addUrls(values);
        this.refs[refname].refs.input.value = '';
        // var value = ;
    }
    removeSeletedUrl = (index) => {
        this.props.contentActions.testgroupActions.deleteUrl(index);
    }
    addUid = () => {
        var type = this.props.content.testgroup.adduidtype;
        var refname = '',values=[];
        if(type === "single"){
            refname = 'uidinputsingle'
        }else{
            refname = 'uidinputmultiple'
        }
        var value = this.refs[refname].refs.input.value;
        if(value.indexOf(';') !== -1){
            values = value.split(';');
        }else{
            values.push(value)

        }
        this.props.contentActions.testgroupActions.addUids(values);
        this.refs[refname].refs.input.value = '';
        // var value = ;
    }
    removeSeletedUid = (index) => {
        this.props.contentActions.testgroupActions.deleteUid(index);
    }
    selectRegion =(values)=> {
        this.props.contentActions.testgroupActions.addCities(values);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        var _this =this;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="分流策略名称"
                    hasFeedback
                >
                    {getFieldDecorator('stra_name', {
                        rules: [{
                            required: true, message: '请输入分流策略名称!',
                        }],
                    })(
                        <Input placeholder="请输入分流策略名称"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="描述"
                    hasFeedback
                >
                    {getFieldDecorator('stra_desc', {
                        rules: [],
                    })(
                        <Input type="textarea"  rows={2} />
                    )}
                </FormItem>
                {/*<FormItem*/}
                    {/*{...formItemLayout}*/}
                    {/*label="生效时间"*/}
                    {/*hasFeedback*/}
                {/*>*/}
                    {/*<RangePicker*/}
                        {/*showTime={{ hideDisabledOptions: true }}*/}
                        {/*format="YYYY-MM-DD HH:mm:ss"*/}
                    {/*/>*/}
                {/*</FormItem>*/}
                <FormItem
                    {...formItemLayout}
                    label={"分流服务器"}
                    hasFeedback
                    required
                >
                    <GLServerTree {...this.props} />
                </FormItem>
                <FormItem className="gl-line-form">
                <div className="gl-line-div"><span className="gl-line"></span><span className="gl-line-content">以下三项至少填写一项</span><span className="gl-line"></span></div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="URL"
                >

                    <div className="gl-url-add-div">{
                        this.props.content.testgroup.addurls.map((url, index) => {
                            if(url !== '')  return (<div key={index}><span className="gl-choice-remove"><Icon type="close" onClick={_this.removeSeletedUrl.bind(_this,index)}/></span><span className="gl-url-add-seleted">{url}</span></div>);
                        })
                    }</div>
                    <RadioGroup className="gl-add-type" defaultValue="multiple" size="default" onChange={this.changeAddUrlType}>
                        <RadioButton value="single" disabled>逐个添加</RadioButton>
                        <RadioButton value="multiple">批量添加</RadioButton>
                    </RadioGroup>
                    {this.props.content.testgroup.addurltype === 'single' ?
                        <div>
                            <Input size="large" ref="urlinputsingle" className="gl-input-with-btn"/>
                            <Button size="large" className="gl-input-btn" onClick={this.addUrl}>添加</Button>
                        </div> :  <div>
                            <Input type="textarea" ref="urlinputmultiple" className="gl-input-with-btn" placeholder="请输入策略生效的url。添加多个，以;分隔" rows={2} />
                            <Button size="large" className="gl-input-btn" onClick={this.addUrl}>添加</Button>
                        </div>}

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="UID"
                ><div className="gl-url-add-div">{
                    this.props.content.testgroup.adduids.map((uid, index) => {
                        if(uid !== '')  return (<div key={index}><span className="gl-choice-remove"><Icon type="close" onClick={_this.removeSeletedUid.bind(_this,index)}/></span><span className="gl-url-add-seleted">{uid}</span></div>);
                    })
                }</div>
                    <RadioGroup className="gl-add-type" defaultValue="multiple" size="default" onChange={this.changeAddUidType}>
                        <RadioButton value="single" disabled>逐个添加</RadioButton>
                        <RadioButton value="multiple">批量添加</RadioButton>
                    </RadioGroup>
                    {this.props.content.testgroup.adduidtype === 'single' ? <div>
                            <Input size="large" ref="uidinputsingle" className="gl-input-with-btn"/>
                            <Button size="large" className="gl-input-btn" onClick={this.addUid}>添加</Button>
                        </div> :  <div>
                            <Input type="textarea" ref="uidinputmultiple" className="gl-input-with-btn" placeholder="请输入策略生效的uid。添加多个，以;分隔" rows={2} />
                            <Button size="large" className="gl-input-btn" onClick={this.addUid}>添加</Button>
                        </div>}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="地域"
                >
                    {getFieldDecorator('stra_cities', {
                        rules: [],
                    })(
                        <Select mode="multiple" onChange={this.selectRegion} placeholder="请选择策略生效区域（可不选）">
                            {this.props.content.testgroup.cities.map((city, index)=> {
                                return <Option key={city.admincode} value={city.name4en}>{city.name}</Option>
                            })}
                        </Select>
                    )}


                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">保存</Button>
                    <Button type="primary" htmlType="submit" size="large">保存并新增</Button>
                </FormItem>
            </Form>
        );
    }
}

const GLForm = Form.create()(RegistrationForm);

export default GLForm;