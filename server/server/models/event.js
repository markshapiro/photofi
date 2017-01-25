'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
    "name": {
        type: String,
        maxlength: 30,
        required: true
    },
    "code": {
        type: String,
        index: true,
        unique:true,
        maxlength: 10,
        required: true
    },
    "photos":[
        {
            phid:{
                type: String,
                maxlength: 30,
                required: true
            },
            created: {
                type: Date,
                required: false,
                default: Date.now
            }
        }
    ],
    "starred": {
        type: String,
        maxlength: 30,
        default:""
    },
    created: {
        type: Date,
        required: false,
        default: Date.now
    }
});

mongoose.model('Event', EventSchema);