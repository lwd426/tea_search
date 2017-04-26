import React, { Component, PropTypes } from 'react'
import './style.css';
import 'antd.min.css';
import GLTestgroup from './components/testgroup';
import GLStragety from './components/stragety';
import GLAddStragety from './components/stragety_cell';
import GLVersionLog from './components/versionlog';


class GLTestinfo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.content.testgroup.showtype)
        return true;
    }
    render() {
        console.log(this.props.content.testgroup.showtype)
        return (
                <div className="content-panel">
                    {(()=> {
                        switch(this.props.content.testgroup.showtype){
                            case 'stragety': return <GLStragety {...this.props}/>; break;
                            case 'testgroup': return <GLTestgroup {...this.props}/>; break;
                            case 'addstragety': return <GLAddStragety {...this.props}/>; break;
                            case 'versionlog': return <GLVersionLog {...this.props}/>; break;
                            default: return <GLTestgroup {...this.props}/>;
                        }
                    })()}
                </div>
        );
    }
}
export default GLTestinfo;