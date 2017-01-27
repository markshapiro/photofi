import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

require('./style.less');

/* actions */
import * as actionCreators from 'actions/events';

@connect(
  state => state.events,
  dispatch => bindActionCreators(actionCreators, dispatch)
)
export class Events extends Component {
    constructor(props){
        super(props);
        this.state={
            key:""
        };
    }
    render() {
        return (
            <div className="events">

                <div className="search">
                    <i className="ion-ios-search-strong" />
                    <input type="text" placeholder="Search" onChange={e=>this.setState({key: e.target.value})} />
                </div>

                <div className="eventsScroller">
                    {this.props.events.filter(ev=>ev.name.indexOf(this.state.key)>=0).map((event, index)=>
                        <div key={index} className="event"
                             style={event.starred ? {background:`url(${event.starred})`} : {}}
                             onClick={()=>this.props.setEvent(event)}>
                            <div className="evName">{event.name}</div>
                        </div>)
                    }
                </div>
            </div>
        )
    }
};