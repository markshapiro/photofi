import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

import { apiErrorMiddleware, routerMiddleware, logger } from '../middleware';

export default function configureStore(initialState, browserHistory) {

  let middleware = applyMiddleware(routerMiddleware, thunkMiddleware, apiErrorMiddleware, logger);

  const store = middleware(createStore)(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
