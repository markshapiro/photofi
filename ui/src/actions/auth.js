import { createAction } from './utils';
import * as api from '../api';
import { routeActions } from 'redux-simple-router';

export function login(data) {
    return dispatch => {
        api.login(data)
            .then(result => dispatch(atLogin(result.data)))
    };
}

export function register(data) {
    return dispatch => {
        api.register(data)
            .then(result => dispatch(atLogin(result.data)))
    };
}

export function atLogin(user) {
    return dispatch => {
        dispatch(createAction("SET_USER",user));
        dispatch(routeActions.push(`/addevent`));
    }
}

export function logout() {
    return dispatch => {
        localStorage.setItem("name", "");
        localStorage.setItem("password", "");
        dispatch(routeActions.push(`/`))
    }
}

export function tryLogIn() {
    return dispatch => {
        if (localStorage.getItem("name")) {
            dispatch(login({name: localStorage.getItem("name"), password: localStorage.getItem("password")}));
        }
    }
}
