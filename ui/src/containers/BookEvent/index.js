import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import * as api from '../../api';

require('./style.less');

/* actions */
import * as actionCreators from 'actions/events';

@connect(
        state => state.events,
        dispatch => bindActionCreators(actionCreators, dispatch)
)
export class BookEvent extends Component {
  render() {
    return (
        <div className="bookEvent">
          <img className="centered hideWhenShort" src={require('./photofi.jpg')} />
          <div className="txtCentered ultraThin title hideWhenShort">Want Photofi in your own event?</div>
          <div className="txtCentered ultraThin title2 hideWhenShort">Please fill the contact info below</div>
          <div className="inputs">
            <div className="inpWrapper">
              <span className="ultraThin">Full name:</span>
              <input type="text" className="roundInput" ref="name"/>
            </div>
            <div className="inpWrapper">
              <span className="ultraThin">Phone No.:</span>
              <input type="text" className="roundInput" ref="phone"/>
            </div>
            <div className="inpWrapper">
              <span className="ultraThin">E-mail:</span>
              <input type="text" className="roundInput" ref="email"/>
            </div>
          </div>
          <button className="button" onClick={()=>this.bookEvent()}>Send</button>
        </div>
    )
  }

  bookEvent(){
    api.bookEvent({
      name: findDOMNode(this.refs.name).value,
      phone: findDOMNode(this.refs.phone).value,
      email: findDOMNode(this.refs.email).value
    })
  }
}
