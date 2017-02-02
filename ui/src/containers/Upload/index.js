import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Popup from 'react-popup';

require('./style.less');

/* actions */
import * as actionCreators from 'actions/events';

@connect(
        state => state.events,
        dispatch => bindActionCreators(actionCreators, dispatch)
)
export class Upload extends Component {
    constructor(props){
        super(props);
        this.state={
            selected:[]
        };
    }
    componentWillMount(){
        this.props.loadFromCard();
        this.props.event.code && Popup.create({
            content: "Select photos you'd like to upload and press green button to minify them first.",
            buttons: {right: ['ok']}
        });
    }
    render() {
        return (
            <div className="upload">
                <div className="btn refresh" onClick={()=>{
                    this.props.loadFromCard();

                }}><i className="ion-refresh"/></div>

                <div className={"btn shrink "+(this.props.action==='upload' && "disabled")}
                     onClick={()=>this.props.shrinkSelected(this.state.selected)}><i className="ion-arrow-shrink"/></div>

                <div className={"btn upload "+(this.props.action==='pick' && "disabled")}
                     onClick={()=>this.props.uploadCardPhotos()}><i className="ion-android-upload"/></div>

                <div className="photosScroller">
                    {this.props.cardPhotos.map((photo)=>{
                        const selected = this.state.selected.indexOf(photo)>=0;
                        return <div key={photo.url} className="img" onClick={()=>this.setState({
                                selected: selected
                                    ?_.without(this.state.selected, photo)
                                    :this.state.selected.concat(photo)
                            })}>
                            <img src={photo.thumb}/>
                            {this.props.action==='pick' && <i className={"star ion-android-checkbox-outline"+(!selected ? '-blank' : '')}  />}
                        </div>
                    })}
                </div>
            </div>
        )
    }
}