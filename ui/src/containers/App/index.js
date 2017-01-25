import React, { Component } from 'react';
require('./common.less');
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';

const titles = {
  '/feed':'Feed',
  '/addevent':'Add event',
  '/events':'Events',
  '/bookevent':'Book event'
};

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
        {title && <Footer titles={titles}/>}
      </section>
    );
  }
}
