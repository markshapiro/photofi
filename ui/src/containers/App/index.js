import React, { Component } from 'react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

require('./common.less');

/* actions */
import * as actionCreators from 'actions/auth';

const titles = {
  '/feed':'Feed',
  '/addevent':'Add event',
  '/events':'Events',
  '/bookevent':'Book event',
  '/upload':'Upload'
};

@connect(
        state => state.auth,
        dispatch => bindActionCreators(actionCreators, dispatch)
)
export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any
  };

  render() {
    const title = titles[this.props.location.pathname];
    return (
      <section>
        {title && <Header hideBackBtn={this.props.location.pathname==='/events'} onLeftClick={()=>this.props.history.goBack()} title={title} />}
        {this.props.children}
        {title && <Footer titles={titles} user={this.props.user}/>}
      </section>
    );
  }
}
