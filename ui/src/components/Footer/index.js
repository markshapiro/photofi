import React, { Component } from 'react';
import { Link } from 'react-router';
import { styles } from './style.less';

export class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <Link className="option feedOption" to="/feed" activeClassName="active">
          <img src={require('./feed-outline.png')} className={'normal'} />
          <img src={require('./feed.png')} className={'pressed'} />
          <div>{this.props.titles['/feed']}</div>
        </Link>
        <Link className="option" to="/addevent" activeClassName="active">
          <i className={'normal ion-ios-plus-outline'} />
          <i className={'pressed ion-ios-plus'} />
          <div>{this.props.titles['/addevent']}</div>
        </Link>
        <Link className="option" to="/events" activeClassName="active">
          <i className={'normal ion-ios-star-outline'} />
          <i className={'pressed ion-ios-star'} />
          <div>{this.props.titles['/events']}</div>
        </Link>
        <Link className="option" to="/bookevent" activeClassName="active">
          <i className={'normal ion-ios-camera-outline'} />
          <i className={'pressed ion-ios-camera'} />
          <div>{this.props.titles['/bookevent']}</div>
        </Link>
      </div>
    );
  }
}