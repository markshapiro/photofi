const initialState = {
  user:null
};

export function auth(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      return Object.assign({},
          state, {
            user: action.payload
          });
  default:
    return state;
  }
}
