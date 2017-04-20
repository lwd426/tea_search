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
        if(!this.props.cont.showSlbModal){
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
        }

    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {domainId} = this.props.cont;
                this.props.contActions.addSlb(values.name, values.domain, domainId)
                this.props.form.setFieldsValue({
                    'name': ''
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
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入测试项名称' }],
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
                    <Row gutter={12}>
                        <Col span={18}>
                            {getFieldDecorator('domain', {
                                rules: [{ required: true, message: '请输入域名!' }],
                            })(
                                <Input prefix={<Icon type="global" style={{ fontSize: 13 }} />}  placeholder="如不知道域名，请向相关人员询问" />
                            )}
                        </Col>
                        <Col span={6}>
                            <Button size="large" onClick={()=>{
                                var domianName = getFieldValue('domain')
                                this.props.contActions.vertifyDomainId(domianName)
                            }}>验证</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem className="gl-version-btn">
                    <Button onClick={()=>{
                        this.props.form.setFieldsValue({
                            'name': '',
                        })
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
