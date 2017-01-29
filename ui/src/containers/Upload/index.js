import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

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
            checked:[]
        };
    }

    componentWillReceiveProps(){
        this.setState({checked:[]})
    }

    render() {

    //import Popup from 'react-popup';
    //    Popup.create({
    //        content: "----",
    //
    //        noOverlay:true
    //    });

        return (
            <div className="upload">
                <button className="load" onClick={()=>this.props.loadFromCamera()}>load from camera</button>
                <button className="upload" onClick={()=>this.props.uploadCameraPhotos(this.state.checked)}><i className="ion-android-upload"/></button>
                <div className="photosScroller">
                    {this.props.cameraPhotos.map((rawPhoto, index)=>{
                        const checked = this.state.checked.indexOf(index)>=0;
                        return <div key={index} className="img" onClick={()=>this.setState({
                                checked: checked
                                    ?_.without(this.state.checked, index)
                                    :this.state.checked.concat(index)
                            })}>
                            <img src={rawPhoto}/>
                            <i className={"star ion-android-checkbox-outline"+(!checked ? '-blank' : '')}  />
                        </div>
                    })}
                </div>
            </div>
        )
    }
}
