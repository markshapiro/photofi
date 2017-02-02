import _ from 'lodash';

const initialState = {
    event:{},
    events:[],
    photos:[],
    lastFetchTime:0,
    cardPhotos:[],
    action:"pick"
};

export function events(state = initialState, action) {
  switch (action.type) {
      case "SET_EVENT":
          return Object.assign({},
              state, {
                  event: action.payload,
                  photos:[],
                  lastFetchTime:0,
                  cardPhotos:[],
                  action:"pick"
              });
      case "SET_PAST_EVENTS":
          return Object.assign({},
              state, {
                  events: action.payload.events
              });
      case "SET_CARD_PHOTOS":
          return Object.assign({},
              state, {
                  cardPhotos: action.payload
              });
      case "SET_UPLOAD_ACTION":
          return Object.assign({},
              state, {
                  action: action.payload,
              });
      case "ADD_PHOTOS":
          return Object.assign({},
              state, {
                  photos: _.uniq(action.payload.map(({url})=>url).concat(state.photos)),
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
