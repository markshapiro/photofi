import _ from 'lodash';

const initialState = {
    event:{},
    events:[],
    photos:[],
    lastFetchTime:0,
    cameraPhotos:[]
};

export function events(state = initialState, action) {
  switch (action.type) {
      case "SET_EVENT":
          return Object.assign({},
              state, {
                  event: action.payload,
                  photos:[],
                  lastFetchTime:0,
                  cameraPhotos:[]
              });
      case "SET_PAST_EVENTS":
          return Object.assign({},
              state, {
                  events: action.payload.events
              });
      case "SET_CAMERA_PHOTOS":
          return Object.assign({},
              state, {
                  cameraPhotos: action.payload
              });
      case "ADD_PHOTOS":
          return Object.assign({},
              state, {
                  photos: _.uniq(action.payload.map(d=>d.url).concat(state.photos)),
                  lastFetchTime: action.payload.length
                      ? Number(action.payload[0].dateupload)+1
                      : state.lastFetchTime
              });
      case "SET_STARRED_PHOTO":
          return Object.assign({},
              state, {
                  event: Object.assign({}, state.event, {
                      starred: action.payload
                  })
              });
    default:
      return state;
  }
}
