import _ from 'lodash';

const initialState = {
    event:null,
    events:[],
    photos:[],
    lastFetchTime:0
};

export function events(state = initialState, action) {
  switch (action.type) {
      case "SET_EVENT":
          return Object.assign({},
              state, {
                  event: action.payload,
                  photos:[],
                  lastFetchTime:0
              });
      case "SET_PAST_EVENTS":
          return Object.assign({},
              state, {
                  events: action.payload.events
              });
      case "ADD_PHOTOS":
          return Object.assign({},
              state, {
                  photos: state.photos.concat(action.payload.map(d=>d.url)),
                  lastFetchTime: action.payload.length
                      ? Number(action.payload[0].dateupload)+1
                      : state.lastFetchTime
              });
    default:
      return state;
  }
}
