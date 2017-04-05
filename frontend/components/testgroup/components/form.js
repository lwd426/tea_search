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
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
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
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
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
            values.push(value)
        }else{
           values = valyue.split(',');
        }
        this.props.contentActions.testgroupActions.addUrls(values);
        // var value = ;
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
        let urls = this.props.content.testgroup.addurls;
        var urlselectedDiv = '<div>';
        if(urls.length === 0) {
            urlselectedDiv = '';
        }else{
            urls.map((url, index) => {
                urlselectedDiv += '<span>'+ url + '</span>';
            })
            urlselectedDiv += '</div>'
        }

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="分流策略名称"
                    hasFeedback
                >
                    {getFieldDecorator('email', {
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
                        <Input type="textarea"  rows={2} />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="生效时间"
                    hasFeedback
                >
                    <RangePicker
                        showTime={{ hideDisabledOptions: true }}
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="分流服务器"
                    hasFeedback
                >
                    <GLServerTree {...this.props} />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="URL"
                >
                    {urlselectedDiv}
                    <RadioGroup defaultValue="multiple" size="default" onChange={this.changeAddUrlType}>
                        <RadioButton value="single" disabled>逐个添加</RadioButton>
                        <RadioButton value="multiple">批量添加</RadioButton>
                    </RadioGroup>
                    {this.props.content.testgroup.addurltype === 'single' ?
                        <div>
                            <Input size="large" ref="urlinputsingle" className="gl-input-with-btn"/>
                            <Button size="large" className="gl-input-btn" onClick={this.addUrl}>添加</Button>
                        </div> :  <div>
                            <Input type="textarea" ref="urlinputmultiple" className="gl-input-with-btn" rows={2} />
                            <Button size="large" className="gl-input-btn" onClick={this.addUrl}>添加</Button>
                        </div>}

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="UID"
                >
                    <RadioGroup defaultValue="multiple" size="default" onChange={this.changeAddUidType}>
                        <RadioButton value="single" disabled>逐个添加</RadioButton>
                        <RadioButton value="multiple">批量添加</RadioButton>
                    </RadioGroup>
                    {this.props.content.testgroup.adduidtype === 'single' ? <div>
                            <Input size="large" className="gl-input-with-btn"/>
                            <Button size="large" className="gl-input-btn">添加</Button>
                        </div> :  <div>
                            <Input type="textarea" className="gl-input-with-btn" rows={2} />
                            <Button size="large" className="gl-input-btn">添加</Button>
                        </div>}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="地域"
                >
                    <Cascader options={options} onChange={(value)=>{

                    }} placeholder="Please select" />

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