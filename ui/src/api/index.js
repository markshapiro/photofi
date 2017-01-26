import axios from 'axios';
require("flickrapi/browser/flickrapi.dev.js");

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

export function addEvent(code) {
  return axios.get(prefix + '/api/'+code+'/add');
}

export function getEvent(code) {
  return axios.get(prefix + '/api/events/'+code);
}

export function bookEvent(data) {
  return axios.post(prefix + '/api/bookevent',data);
}

export function loadNextPhotos(code, tags, date) {
  var flickr = new Flickr({
    api_key: "817677ed2b6d78b3e496dc06e3366f29"
  });
  flickr.photos.search({
    user_id:"150312554@N02",
    tags:"eventCode"
  }, function(err, result) {
    console.log(result)
  });
}