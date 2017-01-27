const initialState = {
    event:null,
    events:[],
    photos:[],
    lastPhotoFetchTime:null
};

export function events(state = initialState, action) {
  switch (action.type) {
      case "SET_EVENT":
          return Object.assign({},
              state, {
                  event: action.payload,
                  photos:[],
                  lastPhotoFetchTime:null
              });
      case "SET_PAST_EVENTS":
          return Object.assign({},
              state, {
                  events: action.payload.events
              });
      case "ADD_PHOTOS":
          return Object.assign({},
              state, {
                  photos: state.photos.concat(action.payload)
              });
    default:
      return state;
  }
}
