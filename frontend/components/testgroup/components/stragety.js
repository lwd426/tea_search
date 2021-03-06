import React, { Component, PropTypes } from 'react'
import '../style.css';
import 'antd.min.css';
import GLInfo from '../../deviceinfo/components/info'
import GLVersionForm from './version_form'
import utilscomps from '../../utilscomps'

import { Table, Input, Icon, Button, Form, Modal, Popconfirm } from 'antd';
const FormItem = Form.Item;
const uuid = require('uuid/v1');
const confirm = Modal.confirm;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class GLStragety extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '策略名称',
            dataIndex: 'name',
            width: '20%',
        }, {
            title: '状态',
            dataIndex: 'status',
            render: (text, record) =>{
                switch(record.status){
                    case 'running': return '运行'; break;
                    case 'stopped': return  '停止';  break;
                    case 'ready': return '准备';break;
                    case 'new': return '新建';break;
                }
            }
        }, {
            title: 'web服务器',
            dataIndex: 'server',
        }, {
            title: '生效url',
            dataIndex: 'urls',
        }, {
            title: '生效uid',
            dataIndex: 'uids',
        }, {
            title: '流量占比',
            dataIndex: 'flowaccounting',
        }, {
            title: '标签',
            dataIndex: 'tag',
        },{
            title: '生效时间',
            dataIndex: 'worktime',
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
                var btntxt = '',
                    status = '';
                switch(record.status){
                    case 'running': btntxt = '停止';status = 'stopped';break;
                    case 'stopped': btntxt = '激活'; status = 'ready';break;
                    case 'ready': btntxt = '停止'; status = 'stopped';break;
                    case 'new': btntxt = '激活'; status = 'ready';break;
                }
                return (
                <span>
                  <a href="#" onClick={()=>{
                      this.props.contentActions.testgroupActions.handleStragety(record.code, status)
                  }}> {btntxt}</a>
                  <span className="ant-divider" />
                  <a href="#" onClick={()=>{
                      if(record.status === 'running') {
                          utilscomps.showNotification('warning', '不能修改','此策略正在运行中，请先停止此策略');
                          return false;
                      }
                      this.props.menu.wintype =  'testinfo';
                      this.props.contentActions.testgroupActions.editStragety(record)
                  }}>修改</a>
                  <span className="ant-divider" />
                  <Popconfirm title="确认删除策略?" onConfirm={() => {
                      if(record.status === 'running') {
                          utilscomps.showNotification('warning', '不能删除','此策略正在运行中，删除前请先停止此策略');
                          return false;
                      }
                      this.props.contentActions.testgroupActions.deleteStragety(record.code,record.slbid, record.testgroupcode)
                  }}>
                    <a href="#">删除</a>
                  </Popconfirm>
                </span>
            )}
        }];

    }
    componentWillReceiveProps =(nextProps)=> {
        return true;
    }
    componentWillMount=()=>{

    }
    onDelete = (index) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    handleAdd = () => {
        // const {slbid, tgid} = this.props.content.testgroup;
        this.props.menu.wintype =  'testinfo';
        this.props.contentActions.testgroupActions.add_stragety()
    }
    generateTags =()=>{
        const {slbid, tgid} = this.props.content.testgroup;
        this.props.contentActions.testgroupActions.generateTags(slbid, tgid);
    }
    generateReferVersion=()=>{
        const {slbid, tgid, servers, refer_stragety} = this.props.content.testgroup;
        var serversinfo = [],serverkeys=[];
        servers.map((server)=>{
            if(server.refer) {
                serversinfo.push(server.ip);
                serverkeys.push(server.key);
            }
        })
        if(refer_stragety) { //如果基准版本存在，则更新它
            var stra_id = refer_stragety.stra_id,
                tag = refer_stragety.tag,
                stra_servers = serversinfo,
                stra_serverskey = serverkeys;
            this.props.contentActions.testgroupActions.updateStragety(stra_id, tgid, slbid, {tag,stra_servers,stra_serverskey } )

        }else{
            const referVersions = {
                desc: '基准版本',
                key: uuid(),
                servers: serversinfo,
                slbid: slbid,
                tgid: tgid,
                uids: [],
                urls: [],
                cities: [],
                name: '基准版本',
                serverskey: serverkeys,
            };
            this.props.contentActions.testgroupActions.generateReferVersion(referVersions);
        }

    }
    goBack = () => {
        this.props.menu.wintype =  'testinfo';
        this.props.contentActions.testgroupActions.goback()
    }
    render() {
        const columns = this.columns;
        const {stragetylist, versionModalShow} = this.props.content.testgroup;
        let tags = [], type = 'refer';
        const  dataSource = stragetylist.map((cell, index)=>{
            if(cell.tag) tags.push(cell.tag);
            if(cell.type === 'normal') type = cell.type;
            return {
                key: cell.objectId,
                slbid:cell.slbid,
                tgid:cell.tgid,
                testgroupcode: cell.tgid,
                stragetycode: cell.objectId,
                code: cell.objectId,
                name: cell.stra_name,
                desc: cell.stra_desc,
                status: cell.stra_status ,
                server: '...',
                serverskey: cell.stra_serverskey,
                urls: '...',
                urlsvalues: cell.stra_urls,
                uids: '...',
                uidsvalues: cell.stra_uids,
                cities: cell.stra_cities,
                flowaccounting: cell.flowaccounting,
                tag: cell.tag,
                worktime: cell.time,
                description: <GLInfo urls={cell.stra_urls} cities={cell.stra_cities} servers={cell.stra_servers} uids={cell.stra_uids}/>
            }
        });

        var _this = this;
        return (

            <div>
                <div className="gl-testinfo-btndiv">
                    <Button className="gl-left-btn" icon="double-left" onClick={this.goBack}>返回</Button>
                    <Button className="gl-left-btn" icon="upload" disabled={type === "refer" ? true: false} onClick={()=>{
                        this.props.contentActions.testgroupActions.publishModal(true);
                    }}>发布到服务器</Button>
                    <Modal title="请输入发布版本的必要信息" closable={false} visible={versionModalShow} footer={null}
                    >
                        <GLVersionForm {..._this.props} />
                    </Modal>
                    <Button className="gl-right-btn" icon="bar-chart"onClick={()=>{
                        let {slbid, tgid, stragetylist} = this.props.content.testgroup;

                        let currentCasVal = [slbid, tgid];
                        this.props.menu.wintype = 'mainpage';
                        {/*this.props.app.collapsed = true;*/}
                        this.props.contentActions.mainpageActions.switchContentShow('none','block','["'+tags.join('","')+'"]',currentCasVal)

                    }}>指标分析</Button>
                    <Button className="gl-right-btn" icon="compass" onClick={this.generateReferVersion}>生成基准版本</Button>
                    <Button className="gl-right-btn" icon="tag" onClick={this.generateTags}>生成数据标签</Button>
                    <Button className="gl-right-btn" icon="plus" onClick={this.handleAdd}>新增策略</Button>
                </div>
                <Table
                    className="gl-testinfo-table"
                    columns={columns}
                    size="middle"
                    expandedRowRender={record => <p>{record.description}</p>}
                    dataSource={dataSource}
                />
            </div>
        );
    }
}


export default GLStragety;
