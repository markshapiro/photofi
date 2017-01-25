import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

require('./style.less');

/* actions */
import * as actionCreators from 'actions/events';

@connect(
  state => state.events,
  dispatch => bindActionCreators(actionCreators, dispatch)
)
export class Feed extends Component {
  constructor(props){
    super(props);
    this.state={
      showGrid:false,
    };
  }

  componentWillMount(){
    this.toggleViewType();
    this.refreshInterval = setInterval(this.refresh, 4000)
  }

  componentWillUnmount(){
    clearInterval(this.refreshInterval);
  }

  refresh(){
  }

  render() {
    const {event} = this.props;
    return (
        <div className="feed">
          <div className="txtCentered title">{event && event.name}</div>
          <img onClick={()=>this.toggleViewType()}
               className="centered flipper"
               src={require(this.state.showGrid?'./squares.png':'./list.png')} />
          <div className="photos">
            {event && event.photos.map(({url})=><img onClick={()=>this.showImage(url)} className={this.state.showGrid?"square":"list"} src={this.getUrlByGridType(url)}/>)}
          </div>
         <div className={"imgEnlarge "+(this.state.showingImg && "showing")}
              style={{'backgroundImage':'url('+this.state.showingImg+')'}}
              onClick={()=>this.setState({showingImg:null})}>
            <i className="ion-share" onClick={e=>{
              e.preventDefault();
              e.stopPropagation();
              this.share(this.state.showingImg);
            }}/>
          </div>
        </div>
    )
  }

  getUrlByGridType(url){
    if(this.state.showGrid){
      return url.replace(/\/image\/upload\/v[0-9]+\//,'/image/upload/c_thumb,h_80,w_80/')
    }
    else{
      return url.replace(/\/image\/upload\/v[0-9]+\//,'/image/upload/c_thumb,h_80,w_240/')
    }
  }

  showImage(url){
    this.setState({
      showingImg:url
    });
  }

  share(url){
    window.plugins.socialsharing.share("", "Share via Photofi", url, null, function () {
    }, function () {
    });
  }

  toggleViewType(){
    this.setState({
      showGrid:!this.state.showGrid
    })
  }
}
