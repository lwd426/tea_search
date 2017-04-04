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
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select className="icp-selector">
                <Option value="86">+86</Option>
            </Select>
        );
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="基本信息"
                    hasFeedback
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                            required: true, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input />
                    )}
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
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your password!',
                        }, {
                            validator: this.checkPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
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
                    <RadioGroup defaultValue="a" size="small">
                        <RadioButton value="a" checked>逐个添加</RadioButton>
                        <RadioButton value="b">批量添加</RadioButton>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="UID"
                >
                    <RadioGroup defaultValue="a" size="small">
                        <RadioButton value="a" checked>逐个添加</RadioButton>
                        <RadioButton value="b">批量添加</RadioButton>
                    </RadioGroup>
                    <Input type="textarea" rows={4} />
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