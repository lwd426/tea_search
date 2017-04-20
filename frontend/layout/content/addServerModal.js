import React, { Component, PropTypes } from 'react'
import './style.css';
import 'antd.min.css';
const uuid = require('uuid/v1');
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
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const slbid = this.props.menu.slbid || '';
                let key = uuid();
                const newData = {
                    key: key,
                    slbid: slbid,
                    ip: values.ip,
                    address: values.datacenter || '',
                    backup: values.backup || '',
                    refer: false
                };
                this.props.contentActions.deviceinfoActions.addWebServer(newData);
                this.props.form.setFieldsValue({
                    'ip': '',
                    'datacenter': '',
                    'backup':''
                })
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError,getFieldValue, getFieldError, isFieldTouched } = this.props.form;
        return (
            <Form className="gl-version-form" layout="inline" onSubmit={this.handleSubmit}>
                <FormItem
                    label="ip地址"
                >
                    {getFieldDecorator('ip', {
                        rules: [{ required: true, message: '必须输入ip地址' },
                            {pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: '请输入合法ip'}],
                    })(
                        <Input prefix={<Icon type="bulb" style={{ fontSize: 13 }} />} placeholder="" />
                    )}
                </FormItem>
                <FormItem
                    label="所属机房"
                >
                    {getFieldDecorator('datacenter', {
                        rules: [{ required: false, message: '' }],
                    })(
                        <Input prefix={<Icon type="database" style={{ fontSize: 13 }} />} placeholder="" />
                    )}
                </FormItem>
                <FormItem
                    label="备注"
                >
                    {getFieldDecorator('backup', {
                        rules: [{ required: false, message: '' }],
                    })(
                        <Input prefix={<Icon type="file-text" style={{ fontSize: 13 }} />} placeholder="" />
                    )}
                </FormItem>
                <FormItem className="gl-version-btn">
                    <Button onClick={()=>{
                        this.props.form.setFieldsValue({
                            'ip': '',
                            'datacenter': '',
                            'backup':''
                        })
                        this.props.contActions.setAddServerModalStatus(false)
                    }}>不了</Button>
                    <Button htmlType="submit" disabled={hasErrors(getFieldsError())}>确定</Button>
                </FormItem>
            </Form>
        );
    }
}

const GLNewTgForm = Form.create()(HorizontalLoginForm);

export default GLNewTgForm;
