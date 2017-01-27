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
export class Upload extends Component {
    constructor(props){
        super(props);
        this.state={};
    }
    render() {
        return (
            <div className="upload">

                upload

            </div>
        )
    }
};
