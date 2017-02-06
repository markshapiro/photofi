import { createAction } from './utils';
import * as api from '../api';
import { routeActions } from 'redux-simple-router';

export function login(data) {
    return dispatch => {
        api.login(data)
            .then(result => dispatch(atLogin(result.data)))
            .then(()=>{
                localStorage.setItem("lastLoginMethod", "regular");
                localStorage.setItem("name", data.name);
                localStorage.setItem("password", data.password);
            })
            .catch(error => {
                localStorage.setItem("lastLoginMethod", "");
                dispatch(createAction("LOGIN_FAILURE", { error }))
            });
    };
}

export function fblogin(data) {
    return dispatch => {
        api.fblogin(data)
            .then(result => dispatch(atLogin(result.data)))
            .then(()=>{
                localStorage.setItem("lastLoginMethod", "fb");
                localStorage.setItem("fbid", data.fbid);
                localStorage.setItem("accessToken", data.accessToken);
            })
            .catch(error => {
                localStorage.setItem("lastLoginMethod", "");
                dispatch(createAction("FB_LOGIN_FAILURE", { error }))
            });
    };
}

export function register(data) {
    return dispatch => {
        api.register(data)
            .then(result => dispatch(atLogin(result.data)))
            .then(()=>{
                localStorage.setItem("lastLoginMethod", "regular");
                localStorage.setItem("name", data.name);
                localStorage.setItem("password", data.password);
            })
            .catch(error => dispatch(createAction("REGISTER_FAILURE", { error })));
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
        if(localStorage.getItem("lastLoginMethod")==="fb"){
            try{facebookConnectPlugin.logout();}catch(e){}
        }
        localStorage.setItem("lastLoginMethod", "");
        dispatch(routeActions.push(`/`))
    }
}

export function tryLogIn() {
    return dispatch => {
        if (localStorage.getItem("lastLoginMethod")) {
            if(localStorage.getItem("lastLoginMethod")==="regular"){
                dispatch(login({name: localStorage.getItem("name"), password: localStorage.getItem("password")}));
            }
            else if(localStorage.getItem("lastLoginMethod")==="fb"){
                dispatch(fblogin({fbid: localStorage.getItem("fbid"), accessToken: localStorage.getItem("accessToken")}));
            }
        }
    }
}
