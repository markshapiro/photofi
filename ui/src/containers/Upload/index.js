import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Popup from 'react-popup';
import { findDOMNode } from 'react-dom';

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
            content: "Select photos you'd like to upload and press green button to minify them first, if you want to add logo then press orange button and select image before you minify.",
            buttons: {right: ['ok']}
        });
    }
    componentWillReceiveProps(){
       if(this.props.action==='pick'){
           this.setState({selected:[]})
       }
    }

    onLogoUpload(){
        var file = findDOMNode(this.refs.logo).files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event=>{
            var image  = new Image();
            image.src    = event.target.result;
            image.onload = ()=>{
                if(image.width>400 || image.width>400){
                    Popup.create({
                        content: "Please select logo image smaller than 400 pixels in width or height",
                        buttons: {right: ['ok']}
                    });
                    return;
                }
                this.setState({logo:image})
            };
        }
    }

    render() {
        return (
            <div className="upload">
                <div className="upperBtn refresh" onClick={()=>this.props.loadFromCard()}><i className="ion-refresh"/></div>
                <div className="upperBtn logo">
                    <i className="ion-image">
                        {this.state.logo && <i className="ion-checkmark checkmark"/>}
                    </i>
                    <input className="innerUpload" type="file" ref="logo" onChange={()=>this.onLogoUpload()} />
                </div>
                <div className={"upperBtn shrink "+(this.props.action==='upload' && "disabled")}
                     onClick={()=>this.props.action==='pick' && this.props.shrinkSelected(this.state.selected, this.state.logo)}><i className="ion-arrow-shrink"/></div>
                <div className={"upperBtn upload "+(this.props.action==='pick' && "disabled")}
                     onClick={()=>this.props.action==='upload' && this.props.uploadCardPhotos()}><i className="ion-android-upload"/></div>
                <div className="photosScroller">
                    {this.props.cardPhotos.map((photo)=>{
                        const selected = this.state.selected.indexOf(photo)>=0;
                        return <div key={photo.url} className="img" onClick={()=>this.setState({
                                selected: selected
                                    ?_.without(this.state.selected, photo)
                                    :this.state.selected.concat(photo)
                            })}>
                            <img src={photo.data || photo.thumb}/>
                            {this.props.action==='pick' && <i className={"star ion-android-checkbox-outline"+(!selected ? '-blank' : '')}  />}
                        </div>
                    })}
                </div>
            </div>
        )
    }
}