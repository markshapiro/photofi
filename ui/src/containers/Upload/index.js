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
export class Upload extends Component {
    constructor(props){
        super(props);
        this.state={};
    }
    render() {
        return (
            <div className="upload">
                <button onClick={()=>this.props.loadFromCamera()}>load from camera</button>
                <button onClick={()=>this.props.uploadCameraPhotosMOCK()}>load MOCK photos</button>
                <button onClick={()=>this.props.uploadCameraPhotos()}>upload to server</button>
                {this.props.cameraPhotos.map((rawPhoto, index)=>
                    <img key={index} src={rawPhoto} style={{width:'25%'}} />
                )}
            </div>
        )
    }
};
