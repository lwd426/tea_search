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
                var name = this.refs.name.refs.input.value || '';
                var desc = this.refs.desc.refs.input.value || '';
                var cities = _this.props.content.testgroup.citiesselected || [];
                var servers = _this.props.content.testgroup.serverselected;
                var serverskey = _this.props.content.testgroup.serverselectedkeys;
                var urls = _this.props.content.testgroup.addurls;
                var uids = _this.props.content.testgroup.adduids;
                const slbid = _this.props.menu.slbid || '';
                const tgid = _this.props.content.testgroup.tgid || '';
                // var type = _this.props.content.testgroup.editting_stragety ? 'modify' : 'add'
                var editting_status = _this.props.content.testgroup.editting_status;
                this.props.contentActions.testgroupActions.validate(editting_status, slbid,tgid,name,desc,cities,servers,serverskey,urls,uids)
            }
        });
    }
    componentWillMount =()=> {
        this.props.contentActions.testgroupActions.getCities();
        const slbid = this.props.menu.slbid || '';
        this.props.contentActions.testgroupActions.getServers(slbid);

    }
    componentDidMount =() => {
    }
    componentWillReceiveProps =(nextProps)=> {
        return true;
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
            values = values.concat(value.split(';'));
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
            values = values.concat(value.split(';'));
        }else{
            values.push(value)

        }
        this.props.contentActions.testgroupActions.addUids(values);
        this.refs[refname].refs.input.value = '';
    }
    removeSeletedUid = (index) => {
        this.props.contentActions.testgroupActions.deleteUid(index);
    }
    selectRegion =(values)=> {
        this.props.contentActions.testgroupActions.addCities(values);
    }
    render() {
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
        var stra_name = '';
        var stra_desc = '';
        var stra_name = '';
        var cities = [];
        var stragety = this.props.content.testgroup.editting_stragety;
        if(stragety){
            stra_name = stragety.name;
            stra_desc = stragety.desc;
            cities = stragety.cities
            if(cities[0] === '') cities =[];
            this.props.content.testgroup.serverselectedkeys = stragety.serverskey;
            this.props.content.testgroup.addurls = stragety.urlsvalues;
            this.props.content.testgroup.adduids = stragety.uidsvalues;
            this.props.content.testgroup.editting_stragety = undefined;
        }
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="分流策略名称"
                    hasFeedback
                    validateStatus={this.props.content.testgroup.validateStra.name.status}
                    help={this.props.content.testgroup.validateStra.name.info}
                    required
                >
                    {/*{getFieldDecorator('stra_name', {*/}
                        {/*rules: [{*/}
                            {/*required: true, message: '请输入分流策略名称!',*/}
                        {/*}],*/}
                    {/*})(*/}
                        <Input ref="name" placeholder="请输入分流策略名称" defaultValue={stra_name}/>
                    {/*)}*/}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="描述"
                >
                    {/*{getFieldDecorator('stra_desc', {*/}
                        {/*rules: [],*/}
                    {/*})(*/}
                        <Input type="textarea" ref="desc" defaultValue={stra_desc} rows={2} />
                    {/*)}*/}
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
                    validateStatus={this.props.content.testgroup.validateStra.server.status}
                    help={this.props.content.testgroup.validateStra.server.info}
                    required
                >
                    <GLServerTree {...this.props}/>
                </FormItem>
                <FormItem className="gl-line-form">
                <div className="gl-line-div"><span className="gl-line"></span><span className="gl-line-content">以下三项至少填写一项</span><span className="gl-line"></span></div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="URL"
                    hasFeedback
                    validateStatus={this.props.content.testgroup.validateStra.url.status}
                    help={this.props.content.testgroup.validateStra.url.info}
                >

                    <div className="gl-url-add-div">{
                        this.props.content.testgroup.addurls.map((url, index) => {
                            url = '<span>'+ url.replace(/ /g, '&nbsp;') + '</span>';
                            if(url !== '')  return (<div key={index}><span className="gl-choice-remove"><Icon type="close" onClick={_this.removeSeletedUrl.bind(_this,index)}/></span><span className="gl-url-add-seleted" dangerouslySetInnerHTML={{__html: url}}></span></div>);
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
                            <Input type="textarea" ref="urlinputmultiple" className="gl-input-with-btn" placeholder="请输入策略生效的url。添加多个，以;分隔 。 规则：请填写相对路径（不能包含域名）；支持正则表达式；如：/ 或 /index.html 或 ^~ /index.html 或 ~* /index.html" rows={2} />
                            <Button size="large" className="gl-input-btn" onClick={this.addUrl}>添加</Button>
                        </div>}

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="UID"
                    hasFeedback
                    validateStatus={this.props.content.testgroup.validateStra.uid.status}
                    help={this.props.content.testgroup.validateStra.uid.info}
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
                    hasFeedback
                    validateStatus={this.props.content.testgroup.validateStra.region.status}
                    help={this.props.content.testgroup.validateStra.region.status}
                >
                    {/*{getFieldDecorator('stra_cities', {*/}
                        {/*rules: [],*/}
                    {/*})(*/}
                        <Select mode="multiple" ref="cities" defaultValue={cities} onChange={this.selectRegion} placeholder="请选择策略生效区域（可不选）">
                            {this.props.content.testgroup.cities.map((city, index)=> {
                                return <Option key={city.admincode} value={city.name4en + ';' +city.name}>{city.name}</Option>
                            })}
                        </Select>
                    {/*)}*/}


                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button  htmlType="submit" size="large">{this.props.content.testgroup.editting_status ? '修改' : '保存' }</Button>
                    <Button  size="large" onClick={this.props.contentActions.testgroupActions.goback2stragelist}>返回</Button>
                </FormItem>
            </Form>
        );
    }
}

const GLForm = Form.create()(RegistrationForm);

export default GLForm;