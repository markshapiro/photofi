import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Popup from 'react-popup';

require('./style.less');

/* actions */
import * as actionCreators from 'actions/events';

@connect(
  state => Object.assign({}, state.events, state.auth.user),
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
    const {photos, event, isPhotographer} = this.props;
    return (
        <div className="feed">
          <div className="txtCentered title">{event.name}</div>
          <img onClick={()=>this.toggleViewType()}
               className="centered flipper"
               src={require(this.state.showGrid?'./squares.png':'./list.png')} />
          <div className="photos">
            {photos.map((url, index)=>{
              return <div key={url} className={"img "+(this.state.showGrid?"square":"list")} onClick={()=>this.state.showGrid && this.setState({showingImg:url+ '_h.jpg'})}>
                  <img src={url+(this.state.showGrid?'_s.jpg':'_h.jpg')}/>
                  {isPhotographer && <i className={'star '+(url+'_h.jpg'===event.starred?"ion-android-star":"ion-android-star-outline")}
                     onClick={e=>{
                      e.preventDefault();
                      e.stopPropagation();
                      this.props.starPhoto(event,url+'_h.jpg');
                    }}/>}
              </div>
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
             <i className="ion-android-download" onClick={e=>{
              e.preventDefault();
              e.stopPropagation();
              this.download(this.state.showingImg);
            }}/>
          </div>
        </div>
    )
  }

    share(url){
        window.plugins.socialsharing.shareWithOptions({
            message: 'Share via Photofi',
            subject: 'Share via Photofi',
            files: [url],
            url: url
        }, ()=>{
            this.onShareFinish("Image shared successfully.");
        }, ()=>{
            this.onShareFinish("Image could not be shared");
        });
    }

    toggleViewType(){
        this.setState({
            showGrid:!this.state.showGrid
        })
    }

    download(url){
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            var canvas = document.createElement('canvas');
            canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
            //canvas.toDataURL("image/jpg", 1.0)
            var params = {
                data: canvas.toDataURL("image/jpg", 1.0),
                prefix: 'myPrefix_', format: 'JPG', quality: 100, mediaScanner: true
            };
            window.imageSaver.saveBase64Image(params,
                (filePath) => {
                    this.onShareFinish("Image saved successfully.");
                },
                (msg) => {
                    this.onShareFinish("Image could not be saved.");
                })
        };
        img.onerror = () => {
            this.onShareFinish("Image could not be saved.");
        };
        img.src = url;
    }

    onShareFinish(title){
        this.setState({showingImg:null});
        Popup.create({
            content: title,
            buttons: {right: ['ok']}
        });
    }
}
