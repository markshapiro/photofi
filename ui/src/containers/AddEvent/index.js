import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';

require('./style.less');

/* actions */
import * as actionCreators from 'actions/events';

@connect(
  state => state.auth,
  dispatch => bindActionCreators(actionCreators, dispatch)
)
export class AddEvent extends Component {
  constructor(props){
    super(props);
    this.state={
      code:"",
      toggled:false
    };
  }
  render() {
    return (
        <div className="addEvent">
          {this.props.user.isPhotographer && <button className={"button switch "+(this.state.toggled && "toggled")} onClick={()=>this.setState({toggled:!this.state.toggled})}>
            <span className="create">create</span>
            <span className="add">add</span>
          </button>}
          <div className="txtCentered ">Add Event by Code:</div>
          {this.state.toggled && <div className="enterCode">
            <span>Event Name:</span>
            <input type="text" className="roundInput" value={this.state.name} onChange={e=>this.setState({name: e.target.value})}  />
          </div>}
          <div className="enterCode">
            <span>Event Code:</span>
            <input type="text" className="roundInput" value={this.state.code} onChange={e=>this.setState({code: e.target.value})}  />
          </div>
          <div className="buttons">
            <button className="button submit" onClick={()=>this.add()}>Submit</button>
            {!this.state.toggled && <button className="button scan" onClick={()=>this.scan()}>Scan QR</button>}
          </div>
        </div>
    );
  }

  add(){
    if(this.state.toggled){
      this.props.createEvent(this.state.code, this.state.name);
    }
    else{
      this.props.addEvent(this.state.code);
    }
  }

  scan(){
    cordova.plugins.barcodeScanner.scan(result=>{
      this.props.addEvent(result.text);
    }, err=>{});
  }
}
