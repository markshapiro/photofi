import axios from 'axios';

const prefix = "http://localhost:4000";
//const prefix = "http://api.photofi.co.il";

export function login(data) {
  return axios.post(prefix + '/api/user/login', data);
}

export function events() {
  return axios.get(prefix + '/api/events');
}

export function register(data) {
  return axios.post(prefix + '/api/user/register', data);
}

export function getEvent(code) {
  return axios.get(prefix + '/api/events/'+code);
}

export function bookEvent(data) {
  return axios.post(prefix + '/api/bookevent',data);
}