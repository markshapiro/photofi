import React, { Component } from 'react';

require('./style.less');

export class ProgressBar extends Component {
  constructor(props){
    super(props);
    this.state={percent:0};
    props.updater.setListener(p=>{
      this.setState({percent:p})
    })
  }
  render() {
    return (
        <div className="progressBar">
          <div className="loader" style={{width:this.state.percent+"%"}}></div>
        </div>
    );
  }
}