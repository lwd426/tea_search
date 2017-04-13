import React, { Component, PropTypes } from 'react'
import { Menu, Input, Popconfirm,Icon, Tooltip} from 'antd';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from './actions'
import * as menuactions from '../menu/actions'
import contentactions from '../../components/actions'
import './style.css';
import 'antd.min.css';

const SubMenu = Menu.SubMenu;

class GLMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        return true;
    }
    componentDidMount(){
        let {actions} = this.props;
        this.props.menuActions.getMenulist();

    }
    changeWintype =(item, key, selected)=>{
        // let {actions} = this.props;
        var infos = item.key.split(',')
        this.props.menuActions.changeShowWinType(infos[0], infos[1]);
    }
    // changeSlb = (item, key, selected) => {
    //     this.props.menuActions.changeSlb(item.key);
    // }
    confirm = () => {
        var name = this.refs.add.value;
        // let {actions} = this.props;
        this.props.menuActions.saveMenu(name)
        this.refs.add.value = '';

    }
    cancel = () => {
        let {actions} = this.props;
        this.props.menuActions.cancelAddTestGroup();
    }
    confirmDelete = (id) => {
        let {actions} = this.props;
        this.props.menuActions.deleteTestGroup(id);
    }
    editMenu = (slbid, slbname) =>{
        this.props.menuActions.editSlbClick(slbid, slbname);
    }
    editConfirm = (slbid)=>{
        var slbname = this.refs.edit.refs.input.value;

        console.log(slbname)
        this.props.menuActions.editSlb(slbid, slbname);
    }
    changeMenu =(item)=>{
        if(!item.key) return false;
        if(item.key.indexOf(',') === -1) return false;
        var code = item.key.split(',')
        this.props.menuActions.changeShowWinType(code[0], code[1]);
    }
    render() {
        return (
            <Menu theme="dark" mode={this.props.app.mode} onClick={this.changeMenu}  >
                {this.props.menu.menulist.map((e, index) =>
                    <SubMenu
                    key={e.objectId}
                    title={<Tooltip placement="right" title={
                        <span>
                            <Icon className="edit-menu"type="edit" onClick={this.editMenu.bind(this, e.objectId, e.name)} />
                            <Popconfirm title="确认删除?" onConfirm={this.confirmDelete.bind(this, e.objectId)}  okText="Yes" cancelText="No">
                                <Icon className="delete-menu" type="delete" />
                            </Popconfirm>
                        </span>}>
                        <span><Icon type="database" />
                            {this.props.menu.editting_slb && this.props.menu.editting_slb.slbid === e.objectId ? (<Input defaultValue={e.name}  onPressEnter={this.editConfirm.bind(this, e.objectId)} className="show-input-edit-testgroup" placeholder="请输入测试组名称" ref="edit"/>) : (<span className="nav-text">{e.name}</span>)}
                        </span>
                           </Tooltip>}
                    >
                    <Menu.Item key={e.objectId+",deviceinfo"}><Icon type="hdd" />设备信息</Menu.Item>
                    <Menu.Item key={e.objectId+",testinfo"}><Icon type="appstore-o" />测试项目</Menu.Item>
                    {/*<Menu.Item key={e.objectId+",datachart"}><Icon type="filter" />数据报表</Menu.Item>
                    <Menu.Item key={e.objectId+",serverlog"}><Icon type="file-text" />服务器日志</Menu.Item>*/}
                    </SubMenu>
                )}

                <Popconfirm title="确认添加?" onConfirm={this.confirm} onCancel={this.cancel} okText="Yes" cancelText="No">
                    <input className={this.props.menu.add ? "show-input-add-testgroup" : "hidden-input-add-testgroup"} placeholder="请输入测试组名称" ref="add"/>
                </Popconfirm>
            </Menu>
        );
    }
}


//将state.counter绑定到props的counter
function mapStateToProps(state) {
    return{
        menu: state.menu,
        app: state.app,
        content: state.content
    }
}
//将action的所有方法绑定到props上
function mapDispatchToProps(dispatch) {
    return  {
        appActions:bindActionCreators(actions,dispatch),
        menuActions:bindActionCreators(menuactions,dispatch),
        contentActions: contentactions(dispatch)
    }
}

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(GLMenu)