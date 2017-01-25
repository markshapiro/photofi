import React, { Component } from 'react';
import { Link } from 'react-router';
import { styles } from './style.less';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/* actions */
import * as actionCreators from 'actions/auth';

@connect(
  state => state.events,
  dispatch => bindActionCreators(actionCreators, dispatch)
)
export class Header extends Component {
  render() {
    return (
      <div className="header">
        {!this.props.hideBackBtn && <div className="topLeft" onClick={()=>this.props.onLeftClick()}>
          <i className="ion-chevron-left" /> <span className="lightGrey">back</span>
        </div>}
        <div className="title UltraThin">{this.props.title}</div>


        <div className="topRight" onClick={()=>this.props.logout()}>
          <span className="lightGrey">logout</span> <i className="ion-log-out" />
        </div>


      </div>
    );
  }
}