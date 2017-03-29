import React, { Component, PropTypes } from 'react'
import { Menu, Input, Popconfirm,Icon, Tooltip} from 'antd';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from './actions'
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
        actions.getMenulist();

    }
    changeWintype =(item, key, selected)=>{
        let {actions} = this.props;
        actions.changeShowWinType(item.key);
    }
    confirm = () => {
        var name = this.refs.add.value;
        let {actions} = this.props;
        actions.saveMenu(name)
        this.refs.add.value = '';

    }
    cancel = () => {
        let {actions} = this.props;
        actions.cancelAddTestGroup();
    }
    confirmDelete = (id) => {
        let {actions} = this.props;
        actions.deleteTestGroup(id);
    }
    render() {
        return (
            <Menu theme="dark" mode={this.props.app.mode}  onSelect={this.changeWintype}>
                {this.props.menu.menulist.map((e, index) =>
                    <SubMenu
                    key={e.objectId}
                    title={<Tooltip placement="right" title={
                        <span>
                            <Icon className="edit-menu"type="edit" />
                            <Popconfirm title="确认删除?" onConfirm={this.confirmDelete.bind(this, e.objectId)}  okText="Yes" cancelText="No">
                                <Icon className="delete-menu" type="delete" />
                            </Popconfirm>
                        </span>}>
                        <span><Icon type="database" /><span className="nav-text">{e.name}</span></span>
                           </Tooltip>}
                    >
                    <Menu.Item key={e.objectId + ",deviceinfo"}><Icon type="hdd" />设备信息</Menu.Item>
                    <Menu.Item key={e.objectId + ",testinfo"}><Icon type="appstore-o" />测试项目</Menu.Item>
                    <Menu.Item key={e.objectId + ",datachart"}><Icon type="filter" />数据报表</Menu.Item>
                    <Menu.Item key={e.objectId + ",serverlog"}><Icon type="file-text" />服务器日志</Menu.Item>
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
            app: state.app
    }
}
//将action的所有方法绑定到props上
function mapDispatchToProps(dispatch) {
    return  {
        actions:bindActionCreators(actions,dispatch)
    }
}

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(GLMenu)