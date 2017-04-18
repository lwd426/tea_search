import React, { Component, PropTypes } from 'react'
import 'antd.min.css';
import utilscomps from '../../utilscomps'
import {  Table, Input, Icon, Button, Popconfirm  } from 'antd';
class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            editable: false,
        }
    }
    componentDidMount(){
        let {item, value} = this.props;
        if(item === 'name' && value === '') this.setState({
            editable: true
        })
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = () => {
        if(this.state.value === ''){
            utilscomps.showNotification('error', '提示', '测试项目必须填写名称！' );
            return false;
        }
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}

export default EditableCell;