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
        return (
            <div className="upload">
                <button className="load" onClick={()=>this.props.loadFromCamera()}>load from card</button>
                <button className="upload" onClick={()=>this.props.uploadCameraPhotos(this.state.checked)}><i className="ion-android-upload"/></button>
                <div className="photosScroller">
                    {this.props.cameraPhotos.map((photo)=>{
                        const checked = this.state.checked.indexOf(photo)>=0;
                        return <div key={photo.url} className="img" onClick={()=>this.setState({
                                checked: checked
                                    ?_.without(this.state.checked, photo)
                                    :this.state.checked.concat(photo)
                            })}>
                            <img src={photo.data}/>
                            <i className={"star ion-android-checkbox-outline"+(!checked ? '-blank' : '')}  />
                        </div>
                    })}
                </div>
            </div>
        )
    }
}
