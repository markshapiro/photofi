import axios from 'axios';
import Q from 'q';
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
  return axios.post(prefix + '/api/events/'+code+'/add');
}

export function getEvent(code) {
  return axios.get(prefix + '/api/events/'+code);
}

export function bookEvent(data) {
  return axios.post(prefix + '/api/bookevent',data);
}

export function loadNextPhotos(code, date) {
  var prom = Q.defer();
  var flickr = new Flickr({
    api_key: "817677ed2b6d78b3e496dc06e3366f29"
  });
  flickr.photos.search({
    user_id:"150312554@N02",
    tags:code,
    per_page:500,
    min_upload_date:date,
    extras:"date_upload"
  }, function(err, result) {
    if(!err){
      result.photos.photo = result.photos.photo.map(({dateupload, farm, server, id, secret})=>({
        dateupload,
        url:`https://farm${farm}.static.flickr.com/${server}/${id}_${secret}`
      }));
      return prom.resolve(result.photos.photo)
    }
    prom.reject(err)
  });
  return prom.promise
}