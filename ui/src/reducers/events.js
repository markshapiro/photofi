const initialState = {
};

export function events(state = initialState, action) {
  switch (action.type) {
    case "SET_EVENT_FEED_CODE":
      return Object.assign({},
          state, {
            code: action.payload.code
          });
    case "SET_EVENT":
      return Object.assign({},
          state, {
            event: action.payload.event
          });
      case "SET_PAST_EVENTS":
          return Object.assign({},
              state, {
                  events: action.payload.events
              });
    default:
      return state;
  }
}
