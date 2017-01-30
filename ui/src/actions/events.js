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
    return (dispatch, getState) => {
        const eventCode = getState().events.event.code;
        api.loadPicsFromCamera()
            .then(rawPhotos=>rawPhotos.filter(url=>!localStorage.getItem(eventCode+"_"+url)))
            .then(rawPhotos=>rawPhotos && processSeries(rawPhotos.map(photo=>()=>cropImage(photo)), "Loading images")
                .then(result=>rawPhotos.map((url, index)=>({url, data: result[index] && result[index].value })).filter(x=>x.data))
                .then(photos=>dispatch(createAction("SET_CAMERA_PHOTOS", photos)))
        )
    }
}

export function uploadCameraPhotos(checked) {
    return (dispatch, getState) => {
        if(!checked.length){return;}
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
        const eventCode = getState().events.event.code;
        popupProm.promise
            .then(()=>processSeries(checked.map(photo=>()=>api.upload(eventCode, photo.data)), 'Uploading Images', 3, ind=>{
                localStorage.setItem(eventCode+"_"+checked[ind].url,'1');
            }))
            .then(result=>checked.map(({url})=>url).filter((x, ind)=>result[ind]))
            .then(successUrls=>dispatch(createAction("SET_CAMERA_PHOTOS", getState().events.cameraPhotos.filter(({url})=>successUrls.indexOf(url)===-1))));
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

function processSeries(promises, title, numOfSimultaneous, onPromiseSuccess){
    var results = [];
    var updater={setListener:function(update){this.update=update;}};
    var popupId = Popup.create({
        title,
        content: <ProgressBar updater={updater}></ProgressBar>,
        buttons: {right: [{
            text: '',
            className: 'unclickable-overlay',
            action: function (popup) {}
        }]}
    });
    var promises2reduce = promises.map((prom, i)=>()=>prom()
            .then(value=>{
                results.push({value});
                updater.update( Math.ceil((results.length/promises.length)*100));
                onPromiseSuccess && onPromiseSuccess(i);
            })
            .catch(()=>{
                results.push(null);
                updater.update( Math.ceil((results.length/promises.length)*100));
            })
    );
    if(numOfSimultaneous>1){
        var promisesRemade=[];
        for(var i=0;i<Math.ceil(promises2reduce.length/numOfSimultaneous);i++){
            var simultaneous = []
            for(var k=i*numOfSimultaneous;k<Math.min(promises2reduce.length, (i+1)*numOfSimultaneous);k++){
                simultaneous.push(promises2reduce[k])
            }
            promisesRemade.push((function(){
                return Q.all(this.map(method=>method()))
            }).bind(simultaneous))
        }
        promises2reduce=promisesRemade;
    }
    return _.reduce(promises2reduce, Q.finally, null)
        .then(()=>{
            Popup.create({
                title:'Process complete',
                content: `Processed ${results.filter(x=>x).length} out of ${results.length}`,
                buttons: {right: ['ok']}
            });
            return results;
        })
        .finally(()=>Popup.close(popupId))
}