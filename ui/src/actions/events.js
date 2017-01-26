import { createAction } from './utils';
import * as api from '../api';
import { routeActions } from 'redux-simple-router';

export function goToEvent(code) {
    return dispatch => {
        api.addEvent(getState().events.code)
            .then(event => {
                dispatch(createAction("SET_EVENT", { event }));
                dispatch(routeActions.push(`/feed`));
            })
            .catch(error => {
                dispatch(routeActions.push(`/addevent`));
            });
    };
}

export function getPastEvents() {
    return dispatch => {
        api.events()
            .then(result => {
                dispatch(createAction("SET_PAST_EVENTS", {events: result.data}));
            })
            .catch(error => {
            });
    }
}

export function loadNextPhotos() {
    return (dispatch, getState) => {

        api.loadNextPhotos()


        dispatch(createAction("ADD_PHOTOS", []));
    }
}