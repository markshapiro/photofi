import { bindActionCreators } from 'redux';
import Q from 'q';

export const createAction = (type, payload) => {
  return { type, payload };
};

export const bindAllActionCreators = (actionCreators, dispatch) => {
  return Object.keys(actionCreators).reduce((result, key) => {
    return Object.assign({}, result, {
      [key]: bindActionCreators(actionCreators[key], dispatch),
    });
  }, {});
};

export const shrinkImage = (url, logo) => {
  var prom = Q.defer();
  var img = new Image();
  const MAX_SIZE = 500;
  img.setAttribute('crossOrigin', 'anonymous');
  img.onload = function () {
    var canvas = document.createElement('canvas'),
        width = img.width,
        height = img.height;
    if (width > height) {
      if (width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      }
    } else {
      if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }
    }
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    if(logo){
      canvas.getContext('2d').drawImage(logo, width - logo.width, height - logo.height, logo.width, logo.height);
    }
    prom.resolve(canvas.toDataURL("image/jpg", 0.8));
  };
  img.onerror = function () {
    prom.reject();
  };
  img.src = url;
  return prom.promise;
};