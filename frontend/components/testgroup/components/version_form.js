import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import { Form, Input,Icon,Button } from 'antd';
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {slbid, tgid} = this.props.content.testgroup;
                var domainId = this.props.menu.domainId;
                this.props.contentActions.testgroupActions.publish(domainId, slbid, tgid, values.versionnum, values.versiondesc)

            }
        });
    }
    closeModal =()=> {
        this.props.contentActions.testgroupActions.publishModal(false)
    }
    // publish = () => {
        // showConfirm()
        // const {slbid} = this.props.content.testgroup;
        // let versionnum = this.refs.versionnum.ref.input.value;
        // let versiondesc = this.refs.versiondesc.ref.input.value;
        // this.props.contentActions.testgroupActions.publish(slbid, versionnum, versiondesc)
    // }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('versionnum') && getFieldError('versionnum');
        const passwordError = isFieldTouched('versiondesc') && getFieldError('versionnum');
        return (
            <Form className="gl-version-form" layout="inline" onSubmit={this.handleSubmit}>
                <FormItem
                    label="版本号"
                    validateStatus={userNameError ? 'error' : ''}
                    help={userNameError || ''}
                >
                    {getFieldDecorator('versionnum', {
                        rules: [{ required: true, message: '请输入版本号' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="例如：v2" />
                    )}
                </FormItem>
                <FormItem
                    label="版本说明"
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                >
                    {getFieldDecorator('versiondesc', {
                        rules: [{ required: true, message: '请输入版本说明' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />}  placeholder="10个字以内" />
                    )}
                </FormItem>
                <FormItem className="gl-version-btn">
                    <Button onClick={this.closeModal}>不发布了</Button>
                    <Button htmlType="submit" disabled={hasErrors(getFieldsError())}>发布</Button>
                </FormItem>
            </Form>
        );
    }
}

const GLVersionForm = Form.create()(HorizontalLoginForm);

export default GLVersionForm;
