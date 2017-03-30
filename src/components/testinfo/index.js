import React, { Component, PropTypes } from 'react'
import './style.css';
import 'antd.min.css';
import GLTestgroup from './components/testgroup';
// import * as actions from './actions'
import GLStragety from './components/stragety';


class GLTestinfo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        return true;
    }
    render() {
        var {showtype}  = this.props;
        return (
                <div className="content-panel">
                    {(()=> {
                        switch(this.props.content.testinfo.showtype){
                            case 'stragety': return <GLStragety {...this.props}/>; break;
                            case 'testgroup': return <GLTestgroup {...this.props}/>; break;
                            default: return <GLTestgroup {...this.props}/>;
                        }
                    })()}
                </div>
        );
    }
}



//将state.counter绑定到props的counter
// function mapStateToProps(state) {
//     return{
//         content: state.content
//     }
// }
// 将action的所有方法绑定到props上
// function mapDispatchToProps(dispatch) {
//     return  {
//         actions: bindActionCreators(actions,dispatch)
//     }
//
// }

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
// export default connect(mapStateToProps, mapDispatchToProps)(GLTestinfo)
export default GLTestinfo;