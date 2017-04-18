import React, { Component, PropTypes } from 'react'
import './style.css';
import 'antd.min.css';
import { Form, Input,Icon,Button } from 'antd';
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
        // this.props.form.validateFields();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // const {slbid, tgid} = this.props.content.testgroup;
                this.props.contActions.addSlb(values.name, values.domain)

            }
        });
    }
    closeModal =()=> {
        this.props.contentActions.testgroupActions.publishModal(false)
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('name') && getFieldError('name');
        const passwordError = isFieldTouched('domain') && getFieldError('domain');
        return (
            <Form className="gl-version-form" layout="inline" onSubmit={this.handleSubmit}>
                <FormItem
                    label="名称"
                    validateStatus={userNameError ? 'error' : ''}
                    help={userNameError || ''}
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入测试项名称' }],
                    })(
                        <Input prefix={<Icon type="bulb" style={{ fontSize: 13 }} />} placeholder="10个字以内" />
                    )}
                </FormItem>
                <FormItem
                    label="域名"
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                >
                    {getFieldDecorator('domain', {
                        rules: [{ required: true, message: '请输入版本域名' }],
                    })(
                        <Input prefix={<Icon type="global" style={{ fontSize: 13 }} />}  placeholder="如不知道域名，请向相关人员询问" />
                    )}
                </FormItem>
                <FormItem className="gl-version-btn">
                    <Button onClick={()=>{
                        this.props.contActions.setAddSLBModalStatus(false)
                    }}>不了</Button>
                    <Button htmlType="submit" disabled={hasErrors(getFieldsError())}>确定</Button>
                </FormItem>
            </Form>
        );
    }
}

const GLVersionForm = Form.create()(HorizontalLoginForm);

export default GLVersionForm;
