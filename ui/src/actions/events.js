import { createAction, cropImage } from './utils';
import * as api from '../api';
import { routeActions } from 'redux-simple-router';
import Q from 'q';

export function addEvent(code) {
    return dispatch => {
        api.addEvent(code.toLowerCase())
            .then(result => dispatch(setEvent(result.data)))
            .catch(error => dispatch(routeActions.push(`/addevent`)));
    };
}

export function setEvent(event) {
    return dispatch => {
        dispatch(createAction("SET_EVENT", event));
        dispatch(routeActions.push(`/feed`));
    };
}

export function getPastEvents() {
    return dispatch => {
        api.events()
            .then(result => dispatch(createAction("SET_PAST_EVENTS", {events: result.data})))
    };
}

export function loadNextPhotos() {
    return (dispatch, getState) => {
        api.loadNextPhotos(getState().events.event.code, getState().events.lastFetchTime)
            .then(photos=>dispatch(createAction("ADD_PHOTOS", photos)))
    }
}

export function loadFromCamera() {
    return dispatch => {
        api.loadPicsFromCamera()
            .then(rawPhotos=>dispatch(createAction("SET_CAMERA_PHOTOS", rawPhotos)))
    }
}

export function uploadCameraPhotos() {
    return (dispatch, getState) => {
        //var some = [
        //    "http://www.fnordware.com/superpng/pnggrad8rgb.png",
        //    "http://www.techinsights.com/uploadedImages/Public_Website/Content_-_Primary/Teardowncom/Sample_Reports/sample-icon.png",
        //    "http://www.wakarusachamber.com/images/400X200.gif",
        //    "http://imgsv.imaging.nikon.com/lineup/lens/zoom/normalzoom/af-s_dx_18-300mmf_35-56g_ed_vr/img/sample/sample4_l.jpg",
        //    "http://thebest3d.com/pdp/landscape200x500.jpg"
        //];
        //const photos = [ some[Math.floor(some.length*Math.random())]  ];
        const photos = getState().events.cameraPhotos;
        Q.all(photos.map(url=>cropImage(url)
                .then(data=>api.upload(getState().events.event.code, data))
                .then(()=>{

                })
                .catch(()=>{
                    alert("upload fail")
                })
        ))
        .then(()=>{

                alert("uploaded successfuly")
                createAction("SET_CAMERA_PHOTOS", [])
            })
    }
}

export function checkIfHasEvent() {
    return (dispatch, getState) => {
        if(!getState().events.event || !getState().events.event.code){
            dispatch(routeActions.push(`/addevent`))
        }
    }
}