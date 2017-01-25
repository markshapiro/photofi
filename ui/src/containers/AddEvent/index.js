import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';

require('./style.less');

/* actions */
import * as actionCreators from 'actions/events';

@connect(
  state => state.events,
  dispatch => bindActionCreators(actionCreators, dispatch)
)
export class AddEvent extends Component {
  constructor(props){
    super(props);
    this.state={
      code:""
    };
  }
  render() {
    return (
        <div className="addEvent">
          <div className="txtCentered ">Add Event by Code:</div>
          <div className="enterCode">
            <span>Event Code:</span>
            <input type="text" className="roundInput" value={this.state.code} onChange={e=>this.setState({code: e.target.value})}  />
          </div>
          <button className="button submit" onClick={()=>this.add()}>Submit</button>
          <button className="button scan" onClick={()=>this.scan()}>Scan QR</button>
        </div>
    )
  }

  add(){
    this.props.goToEvent(this.state.code);
  }

  scan(){
    cordova.plugins.barcodeScanner.scan(result=>{
      this.props.goToEvent(result.text);
    }, err=>{});
  }
}
