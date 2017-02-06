import { createAction, shrinkImage } from './utils';
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

export function loadFromCard() {
    return (dispatch, getState) => {
        const eventCode = getState().events.event.code;
        api.loadPicsFromCard()
            .then(photoList=>photoList.filter(({url})=>!localStorage.getItem(eventCode+"_"+url)))
            .then(photoList=>{
                dispatch(createAction("SET_CARD_PHOTOS", photoList))
                dispatch(createAction("SET_UPLOAD_ACTION", 'pick'))
            })
    };
}

export function shrinkSelected(selected, logo) {
    return dispatch => {
        selected.length && processSeries(selected.map(photo=>()=>shrinkImage(photo.url, logo)), "Minimizing images", "Minimize completed",
            "Before you press red button to upload, make sure you have internet connection.", 2)
            .then(result=>selected.map((chck, index)=>Object.assign({},chck,{ data: result[index] && result[index].value})).filter(x=>x.data))
            .then(photos=>{
                if(photos.length){
                    dispatch(createAction("SET_CARD_PHOTOS", photos));
                    dispatch(createAction("SET_UPLOAD_ACTION", 'upload'));
                }
                else{
                    dispatch(loadFromCard());
                }
            });
    };
}

export function uploadCardPhotos() {
    return (dispatch, getState) => {
        const photos = getState().events.cardPhotos;
        const eventCode = getState().events.event.code;
        photos.length && processSeries(photos.map(photo=>()=>api.upload(eventCode, photo.data)), 'Uploading images', "Upload completed", "", 3, ind=>{

            console.log(eventCode+"_"+photos[ind].url)

            localStorage.setItem(eventCode+"_"+photos[ind].url,'1');
        })
        .then(()=>dispatch(loadFromCard()));
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

function processSeries(promises, title, endingTitle, endingMessage, numOfSimultaneous, onPromiseSuccess){
    var results = [];
    var updater={setListener:function(update){this.update=update;}};
    var popupId = Popup.create({
        title,
        content: <ProgressBar updater={updater}></ProgressBar>,
        buttons: {right: [{
            text: '',
            className: 'blocking-popup',
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
                title:endingTitle,
                content: <div>{`Processed ${results.filter(x=>x).length} out of ${results.length}`} {endingMessage && <div>{endingMessage}</div>}</div>,
                buttons: {right: ['ok']}
            });
            return results;
        })
        .finally(()=>Popup.close(popupId))
}