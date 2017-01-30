import axios from 'axios';
import Q from 'q';
require("flickrapi/browser/flickrapi.dev.js");

const prefix = "http://api.photofi.co.il";
//const prefix = "http://localhost:4000";

const flashAirPrefix = "http://flashair";
//const flashAirPrefix = "http://localhost:5000";

var flickr = new Flickr({
  api_key: "817677ed2b6d78b3e496dc06e3366f29"
});

export function login(data) {
  return axios.post(prefix + '/api/user/login', data);
}

export function events() {
  return axios.get(prefix + '/api/event');
}

export function register(data) {
  return axios.post(prefix + '/api/user/register', data);
}

export function addEvent(code) {
  return axios.post(prefix + '/api/event/'+code+'/add');
}

export function createEvent(code, name) {
  return axios.post(prefix + '/api/event', {code, name});
}

export function updateEvent(event) {
  return axios.put(prefix + '/api/event/'+event.code, event);
}

export function getEvent(code) {
  return axios.get(prefix + '/api/event/'+code);
}

export function bookEvent(data) {
  return axios.post(prefix + '/api/bookevent',data);
}

export function upload(code, data) {
  return axios.post(prefix + '/api/event/'+code+'/upload',{data});
}

export function loadNextPhotos(code, date) {
  return axios.get(prefix + '/api/event/'+code+'/photos/'+date).then(({data})=>data);
}

export function loadPicsFromCamera(prefix='/DCIM'){
  return axios.get(flashAirPrefix+'/command.cgi?op=100&DIR='+prefix)
    .then(result=>{
      var photos=[];
      var proms=[];
      result.data.split('\n')
          .slice(1)
          .map(row=>row.split(','))
          .filter(cols=>cols.length>=2)
          .forEach(cols=>{
            if(cols[2]=='0') proms.push(loadPicsFromCamera(prefix+'/'+cols[1]));
            else if(cols[1].match(/.(jpg|jpeg|png|JPG|JPEG|PNG)$/g)) photos.push(flashAirPrefix+prefix+'/'+cols[1]);
      });
      return Q.all(proms)
        .then(res=>photos.concat.apply(photos, res))
    });
}
