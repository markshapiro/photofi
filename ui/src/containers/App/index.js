import React, { Component } from 'react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import Popup from 'react-popup';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

require('./common.less');

/* actions */
import * as actionCreators from 'actions/auth';

@connect(
        state => state.auth,
        dispatch => bindActionCreators(actionCreators, dispatch)
)
export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any
  };

  componentWillMount(){
    this.updateTitles();
  }
  componentDidUpdate(prevProps, prevState){
    this.updateTitles();
  }

  updateTitles(){
    this.titles = {
      '/feed': this.props.user && this.props.user.isPhotographer ? 'Manage' : 'Feed',
      '/addevent':'Add event',
      '/events':'Events',
      '/bookevent':'Book event',
      '/upload': 'Upload'
    };
  }

  render() {
    const title = this.titles[this.props.location.pathname];
      return (
      <section>
        {title && <Header hideBackBtn={this.props.location.pathname==='/events'} onLeftClick={()=>this.props.history.goBack()} title={title} />}
        {this.props.children}
        {title && <Footer titles={this.titles} user={this.props.user}/>}
        <Popup className="my-popup" closeBtn={false}/>
      </section>
    );
  }
}