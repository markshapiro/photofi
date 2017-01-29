import { createAction, cropImage } from './utils';
import * as api from '../api';
import { routeActions } from 'redux-simple-router';
import Q from 'q';
import Popup from 'react-popup';
import { ProgressBar } from '../components/ProgressBar'
import React from 'react';

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
            .then(rawPhotos=>Q.all(rawPhotos.map(url=>cropImage(url))))
            .then(rawPhotos=>dispatch(createAction("SET_CAMERA_PHOTOS", rawPhotos)))
            .catch(error=>dispatch(createAction("LOAD_PHOTOS_FAILURE", { error })))
    }
}

export function uploadCameraPhotos(checked) {
    return (dispatch, getState) => {
        var popupProm = Q.defer();
        Popup.create({
            content: "Are you sure you want to upload "+checked.length+" photos?",
            buttons: {right: [{
                text: 'No',
                action: function (Box) {Box.close();}
            }, {
                text: 'Yes',
                action: function (Box) {
                    popupProm.resolve();
                    Box.close();
                }
            }]}
        });
        popupProm.promise.then(()=>{
            const eventCode = getState().events.event.code;
            const cameraPhotos = getState().events.cameraPhotos;
            var updater={
                setListener:function(update){
                    this.update=update
                }
            };
            var popupId = Popup.create({
                title:'Uploading Images',
                content: <ProgressBar updater={updater}></ProgressBar>
            });
            var finished = 0, succeeded = [];
            var allPhotoPromises = checked
                .map(ind=>()=>api.upload(eventCode, cameraPhotos[ind])
                    .then(()=>{
                        succeeded.push(ind);
                        finished++;
                        updater.update( Math.ceil((finished/checked.length)*100));
                    })
                    .catch(()=>{
                        finished++;
                        updater.update( Math.ceil((finished/checked.length)*100));
                    }));

            _.reduce(allPhotoPromises, Q.finally, null)
                .then(()=>{
                    Popup.close(popupId);
                    dispatch(createAction("SET_CAMERA_PHOTOS", cameraPhotos.filter((x,i)=>succeeded.indexOf(i)===-1)))
                    Popup.create({
                        title:'Uploading Complete',
                        content: `Uploaded ${succeeded.length} out of ${finished} photos`,
                        buttons: {right: ['ok']}
                    });
                })

        })
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