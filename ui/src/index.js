import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import configureStore from './store/configureStore';
import configureRoutes from './routes';

const history = useRouterHistory(createHashHistory)({ queryKey: false });
const store = configureStore({}, history);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={configureRoutes(store)} />
  </Provider>,
  document.getElementById('root')
);
