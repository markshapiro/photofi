import axios from 'axios';
import Q from 'q';

const apiPrefix = "http://api.photofi.co.il";
//const apiPrefix = "http://localhost:4000";

//const wlanPrefix = "http://flashair";
const wlanPrefix = "http://localhost:5000";

export function login(data) {
  return axios.post(apiPrefix + '/api/user/login', data);
}

export function events() {
  return axios.get(apiPrefix + '/api/event');
}

export function register(data) {
  return axios.post(apiPrefix + '/api/user/register', data);
}

export function addEvent(code) {
  return axios.post(apiPrefix + '/api/event/'+code+'/add');
}

export function createEvent(code, name) {
  return axios.post(apiPrefix + '/api/event', {code, name});
}

export function updateEvent(event) {
  return axios.put(apiPrefix + '/api/event/'+event.code, event);
}

export function getEvent(code) {
  return axios.get(apiPrefix + '/api/event/'+code);
}

export function bookEvent(data) {
  return axios.post(apiPrefix + '/api/bookevent',data);
}

export function upload(code, data) {
  return axios.post(apiPrefix + '/api/event/'+code+'/upload',{data});
}

export function loadNextPhotos(code, date) {
  return axios.get(apiPrefix + '/api/event/'+code+'/photos/'+date).then(({data})=>data);
}

export function loadPicsFromCamera(prefix='/DCIM'){
  return axios.get(wlanPrefix+'/command.cgi?op=100&DIR='+prefix)
    .then(result=>{
      var photos=[];
      var proms=[];
      result.data.split('\n')
          .slice(1)
          .map(row=>row.split(','))
          .filter(cols=>cols.length>=2)
          .forEach(cols=>{
            if(cols[2]=='0') proms.push(loadPicsFromCamera(prefix+'/'+cols[1]));
            else if(cols[1].match(/.(jpg|jpeg|png|JPG|JPEG|PNG)$/g)) photos.push(wlanPrefix+prefix+'/'+cols[1]);
      });
      return Q.all(proms)
        .then(res=>photos.concat.apply(photos, res))
    });
}
