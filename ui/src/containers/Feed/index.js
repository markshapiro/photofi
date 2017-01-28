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
    this.refreshInterval = setInterval(this.refresh.bind(this), 4000);
    this.props.loadNextPhotos();
  }

  componentWillUnmount(){
    clearInterval(this.refreshInterval);
  }

  refresh(){
    this.props.loadNextPhotos();
  }

  render() {
    const {photos, event} = this.props;
    return (
        <div className="feed">
          <div className="txtCentered title">{event.name}</div>
          <img onClick={()=>this.toggleViewType()}
               className="centered flipper"
               src={require(this.state.showGrid?'./squares.png':'./list.png')} />
          <div className="photos">
            {photos.map(url=>{
              return <img
                  key={url}
                  onClick={()=>this.state.showGrid && this.setState({showingImg:url+ '_h.jpg'})}
                  src={url+(this.state.showGrid?'_s.jpg':'_h.jpg')}
                  className={this.state.showGrid?"square":"list"} />
            })}
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
