import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import { Form, Input, Tooltip, Icon, Button } from 'antd';
const FormItem = Form.Item;


class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
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
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="SLB域名"
                    hasFeedback
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '您输入的不是域名，请核实',
                        }, {
                            required: true, message: '请输入域名',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>域名ID&nbsp;
                            <Tooltip title="不知道ID规则?">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                        )}
                        hasFeedback
                    >
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 16, offset: 8 },
                    }}
                >
                    <Button type="primary" htmlType="submit" size="large">保存</Button>
                    <Button type="primary" htmlType="submit" size="large">取消</Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);


export default WrappedRegistrationForm;