import React, { Component, PropTypes } from 'react'
import './style.css';
import 'antd.min.css';

import { Form, Input,Icon,Button,Row, Col } from 'antd';
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps){

    }
    handleSubmit = (e) => {
        e.preventDefault();
        var forms = this.props.form;
        forms.validateFields((err, values) => {
            if (!err) {
                this.props.contActions.addSlb(values.name, values.domain, function(){
                    forms.setFieldsValue({
                            'name': '',
                            'domain':''
                        })
                })
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError,getFieldValue, getFieldError, isFieldTouched } = this.props.form;
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
        return (
            <Form className="gl-version-form" layout="inline" onSubmit={this.handleSubmit}>
                <FormItem
                    label="名称"
                    validateStatus={this.props.cont.validateDomain.name.status}
                >
                    {getFieldDecorator('name' , { initialValue: this.props.cont.validateDomain.name.data }, {
                    })(
                        <Input prefix={<Icon type="bulb" style={{ fontSize: 13 }} />} placeholder="10个字以内" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="域名"
                    validateStatus={this.props.cont.validateDomain.domain.status}
                    extra={this.props.cont.validateDomain.domain.info}
                >
                        {getFieldDecorator('domain', { initialValue: this.props.cont.validateDomain.domain.data },{
                    })(
                        <Input prefix={<Icon type="global" style={{ fontSize: 13 }} />}  placeholder="如不知道域名，请向相关人员询问" />
                        )}
                </FormItem>
                {/*<FormItem*/}
                    {/*label="p1"*/}
                    {/*validateStatus={this.props.cont.validateDomain.name.status}*/}
                {/*>*/}
                    {/*{getFieldDecorator('p1', {*/}
                        {/*rules: [{ required: false, message: '' }],*/}
                    {/*})(*/}
                        {/*<Input prefix={<Icon type="bulb" style={{ fontSize: 13 }} />} placeholder="请联系大数据部获取值" />*/}
                    {/*)}*/}
                {/*</FormItem>*/}
                {/*<FormItem*/}
                    {/*label="p2"*/}
                    {/*validateStatus={this.props.cont.validateDomain.name.status}*/}
                {/*>*/}
                    {/*{getFieldDecorator('p2', {*/}
                        {/*rules: [{ required: false, message: '' }],*/}
                    {/*})(*/}
                        {/*<Input prefix={<Icon type="bulb" style={{ fontSize: 13 }} />} placeholder="请联系大数据部获取值" />*/}
                    {/*)}*/}
                {/*</FormItem>*/}
                <FormItem className="gl-version-btn">
                    <Button onClick={()=>{
                        this.props.form.setFieldsValue({
                            'name': '',
                            'domain':''
                        })
                        this.props.cont.validateDomain = {
                            name: {
                                status: '',
                                info: '请输入名称'
                            },
                            domain: {
                                status: '',
                                info: '我们需要验证您填写的域名ID是否正确'
                            }
                        }
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
