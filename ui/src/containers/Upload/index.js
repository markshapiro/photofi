import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//import { default as swal } from 'sweetalert2'

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

        //swal({
        //    title: 'Error!',
        //    text: 'Do you want to continue',
        //    type: 'error',
        //    confirmButtonText: 'Cool'
        //})
    }
    render() {
        return (
            <div className="upload">
                <button onClick={()=>this.props.loadFromCamera()}>load from camera</button>
                <button onClick={()=>this.props.uploadCameraPhotos()}>upload to server</button>
                {this.props.cameraPhotos.map((rawPhoto, index)=>
                    <img key={index} src={rawPhoto} style={{width:'25%'}} />
                )}
            </div>
        )
    }
};
