import { createAction, cropImage } from './utils';
import * as api from '../api';
import { routeActions } from 'redux-simple-router';
import Q from 'q';

export function addEvent(code) {
    return dispatch => {
        api.addEvent(code)
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
        const photos = ["http://www.fnordware.com/superpng/pnggrad8rgb.png", "http://www.fnordware.com/superpng/pnggrad8rgb.png"];
        //const photos = getState().events.cameraPhotos;
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