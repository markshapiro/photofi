import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import { auth } from './auth';
import { events } from './events';

const rootReducer = combineReducers({
  routing: routeReducer,
  /* your reducers */
  auth,
  events
});

export default rootReducer;
