import { createAction } from './utils';
import * as api from '../api';
import { routeActions } from 'redux-simple-router';

export function login(data) {
    return dispatch => {
        api.login(data)
            .then(result => {
                dispatch(createAction("LOGIN_SUCCES"));
                dispatch(routeActions.push(`/addevent`));
            })
            .catch(error => dispatch(createAction("LOGIN_FAILURE", { error })));
    };
}

export function register(data) {
    return dispatch => {
        api.register(data)
            .then(result => {
                dispatch(createAction("REGISTER_SUCCES"));
                dispatch(routeActions.push(`/addevent`));
            })
            .catch(error => dispatch(createAction("REGISTER_FAILURE", { error })));
    };
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
