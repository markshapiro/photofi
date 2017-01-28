import { createAction, cropImage } from './utils';
import * as api from '../api';
import { routeActions } from 'redux-simple-router';
import Q from 'q';
import Popup from 'react-popup';

export function addEvent(code) {
    return dispatch => {
        api.addEvent(code.toLowerCase())
            .then(result => dispatch(setEvent(result.data)))
            .catch(error => {
                dispatch(routeActions.push(`/addevent`));
                dispatch(createAction("ADD_EVENT_FAILURE", { error }));
            });
    };
}

export function createEvent(code, name) {
    return dispatch => {
        api.createEvent(code.toLowerCase(), name)
            .then(result => dispatch(setEvent(result.data)))
            .catch(error => {
                dispatch(createAction("CREATE_EVENT_FAILURE", { error }));
                dispatch(routeActions.push(`/addevent`))
            });
    };
}

export function setEvent(event) {
    return dispatch => {
        dispatch(createAction("SET_EVENT", event));
        dispatch(routeActions.push(`/feed`));
    };
}

export function starPhoto(event, url) {
    return dispatch => {
        api.updateEvent(Object.assign({}, event, {starred: url}))
            .then(result => dispatch(createAction("SET_STARRED_PHOTO", url)))
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
            .catch(error=>dispatch(createAction("LOAD_PHOTOS_FAILURE", { error })))
    }
}

export function uploadCameraPhotos() {
    return (dispatch, getState) => {
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
            dispatch(createAction("SET_CAMERA_PHOTOS", []))
        })
        .catch(error=>dispatch(createAction("UPLOAD_FAILURE", { error })))
    }
}

export function checkIfHasEvent() {
    return (dispatch, getState) => {
        if(!getState().events.event || !getState().events.event.code){
            Popup.create({
                title: "No Event",
                content: "Please add or enter existing event",
                buttons: {right: ['ok']}
            });
            dispatch(routeActions.push(`/addevent`))
        }
    }
}




export function uploadCameraPhotosMOCK(photos) {
    return dispatch => {
        var some = [
            "http://www.fnordware.com/superpng/pnggrad8rgb.png",
            "http://www.techinsights.com/uploadedImages/Public_Website/Content_-_Primary/Teardowncom/Sample_Reports/sample-icon.png",
            "http://www.wakarusachamber.com/images/400X200.gif",
            "http://imgsv.imaging.nikon.com/lineup/lens/zoom/normalzoom/af-s_dx_18-300mmf_35-56g_ed_vr/img/sample/sample4_l.jpg",
            "http://imgsv.imaging.nikon.com/lineup/lens/zoom/normalzoom/af-s_nikkor28-300mmf_35-56gd_ed_vr/img/sample/sample4_l.jpg"
        ];
        dispatch(createAction("SET_CAMERA_PHOTOS", [   some[Math.floor(some.length*Math.random())] , some[Math.floor(some.length*Math.random())]  ]))
    }
}