import { createAction } from './utils';
import * as api from '../api';
import { routeActions } from 'redux-simple-router';

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
            .catch(error => {});
    };
}

export function loadNextPhotos() {
    return (dispatch, getState) => {
        api.loadNextPhotos(getState().events.event.code)
            .then(photos=>dispatch(createAction("ADD_PHOTOS", photos)))
    }
}