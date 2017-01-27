import React from 'react';
import { Route, IndexRoute } from 'react-router';

/* containers */
import { App } from 'containers/App'
import { LogIn } from 'containers/LogIn';
import { AddEvent } from 'containers/AddEvent';
import { Feed } from 'containers/Feed';
import { Events } from 'containers/Events';
import { BookEvent } from 'containers/BookEvent';
import { Upload } from 'containers/Upload';

import * as actionCreators from 'actions';
import { bindAllActionCreators } from 'actions/utils';

export default function (store) {
  const actions = bindAllActionCreators(actionCreators, store.dispatch);
  return <Route path="/" component={App} onEnter={()=>actions.auth.tryLogIn()}>
    <IndexRoute component={LogIn}/>
    <Route path="addevent" component={AddEvent}/>
    <Route path="feed" component={Feed} onEnter={()=>{actions.events.checkIfHasEvent();}}/>
    <Route path="events" component={Events} onEnter={()=>actions.events.getPastEvents()}/>
    <Route path="bookevent" component={BookEvent} />
    <Route path="upload" component={Upload} onEnter={()=>actions.events.checkIfHasEvent()}/>
    <Route status={404} path="*" component={LogIn} />
  </Route>;
}
