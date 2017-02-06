import axios from 'axios';
import Q from 'q';

//const apiPrefix = "http://api.photofi.co.il";
const apiPrefix = "http://localhost:4000";

const wlanPrefix = "http://flashair";
//const wlanPrefix = "http://localhost:5000";

export function login(data) {
  return axios.post(apiPrefix + '/api/user/login', data);
}

export function fblogin(data) {
  return axios.post(apiPrefix + '/api/user/fblogin', data);
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

export function loadPicsFromCard(prefix='/DCIM'){

  var arr =[];

  for(var i=0;i<20;i++){
    arr.push({
      url:"http://eoimages.gsfc.nasa.gov/images/imagerecords/43000/43171/channel_tmo_2009075_lrg.jpg?test="+i,
      thumb:"data:image/jpeg;base64,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"
    })
  }

  return Q(arr);


  return axios.get(wlanPrefix+'/command.cgi?op=100&DIR='+prefix)
    .then(result=>{
      var photos=[];
      var proms=[];
      result.data.split('\n')
          .slice(1)
          .map(row=>row.split(','))
          .filter(cols=>cols.length>=2)
          .forEach(cols=>{
            if(cols[2]=='0') proms.push(loadPicsFromCard(prefix+'/'+cols[1]));
            else if(cols[1].match(/.(jpg|jpeg|png|JPG|JPEG|PNG)$/g)) photos.push({
              url:wlanPrefix+prefix+'/'+cols[1],
              thumb:wlanPrefix+'/thumbnail.cgi?'+prefix+'/'+cols[1]
            });
      });
      return Q.all(proms)
        .then(res=>photos.concat.apply(photos, res))
    });
}
