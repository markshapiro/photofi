import createLogger from 'redux-logger';
import { syncHistory } from 'redux-simple-router';
import { hashHistory } from 'react-router';
import Popup from 'react-popup';

const errors={
  'LOGIN_FAILURE.BAD REQUEST':'Please enter valid credentials',
  'LOGIN_FAILURE.UNAUTHORIZED':'Wrong name or password',
  'REGISTER_FAILURE.VALIDATIONERROR':'Please enter valid credentials',
  'REGISTER_FAILURE.USER_EXISTS':'User with this name or email already exists',
  'ADD_EVENT_FAILURE.CANNOT_ENTER_AS_PHOTOGRAPHER':'This event is not assigned to your photographer account',
  'ADD_EVENT_FAILURE.NO_RECORD':'Could not find event matching your code',
  'CREATE_EVENT_FAILURE.VALIDATIONERROR':'Please enter event with alphanumeric code',
  'CREATE_EVENT_FAILURE.11000':'Event with such code already exists',
};

// should catch any API errors and act accordingly
export const apiErrorMiddleware = store => next => action => {
  const result = next(action);
  if (result.payload && result.payload.error) {
    const { error } = result.payload;
    const errName = error.response.data.name || error.response.data.code || error.response.data;
    const errorKey = result.type +"."+errName.toUpperCase();
    if(errors[errorKey]){
      Popup.create({
        content: errors[errorKey],
        buttons: {right: ['ok']}
      });
      return result;
    }
    switch (error.status) {
      case 400:
      case 500:
        Popup.create({
          content: "There was a problem with your request",
          buttons: {right: ['ok']}
        });
        break;
      case 401:
        break;
      case 404:
        break;
      default:
        Popup.create({
          content: "Sorry, an error has occurred",
          buttons: {right: ['ok']}
        });
        break;
    }
  }
  return result;
};

export const routerMiddleware = syncHistory(hashHistory);

export const logger = createLogger({
  collapsed: true,
  predicate: () =>
  process.env.NODE_ENV === `development`, // eslint-disable-line no-unused-vars
});
