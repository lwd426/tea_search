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
        if(!this.props.cont.showSlbModal) {
            this.props.form.setFieldsValue({
                'name': '',
            })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const slbid = this.props.menu.slbid || '';
                let count = uuid();
                let newData =  {
                    key: count ,
                    slbid: slbid,
                    code:  count,
                    name: values.name,
                    status: 'new',
                    flowaccounting: '',
                    time:'',
                    version: ''}
                this.props.contentActions.testgroupActions.addTestGroup(newData)
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError,getFieldValue, getFieldError, isFieldTouched } = this.props.form;
        return (
            <Form className="gl-version-form" layout="inline" onSubmit={this.handleSubmit}>
                <FormItem
                    label="名称"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入策略组名称' }],
                    })(
                        <Input prefix={<Icon type="bulb" style={{ fontSize: 13 }} />} placeholder="" />
                    )}
                </FormItem>
                <FormItem className="gl-version-btn">
                    <Button onClick={()=>{
                        this.props.contActions.setAddTgModalStatus(false)
                    }}>不了</Button>
                    <Button htmlType="submit" disabled={hasErrors(getFieldsError())}>确定</Button>
                </FormItem>
            </Form>
        );
    }
}

const GLNewTgForm = Form.create()(HorizontalLoginForm);

export default GLNewTgForm;
