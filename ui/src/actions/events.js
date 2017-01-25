import { createAction } from './utils';
import * as api from '../api';
import { routeActions } from 'redux-simple-router';

export function goToEvent(code) {
    return dispatch => {
        dispatch(createAction("SET_EVENT_FEED_CODE", { code }));
        dispatch(routeActions.push(`/feed`));
    };
}

export function loadEvent() {
    return (dispatch, getState) => {
        if(!getState().events.code){
            return dispatch(routeActions.push(`/addevent`));
        }
        api.getEvent(getState().events.code)
            .then(result => {
                dispatch(createAction("SET_EVENT", { event: result.data }));
            })
            .catch(error => {
                dispatch(routeActions.push(`/addevent`));
            });
    }
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