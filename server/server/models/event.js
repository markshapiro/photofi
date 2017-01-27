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
        required: true,
        validate: [value=>value.match(/^[a-zA-Z0-9]+$/g)]
    },
    "starred": {
        type: String,
        maxlength: 100,
        default:null
    },
    created: {
        type: Date,
        required: false,
        default: Date.now
    }
});

mongoose.model('Event', EventSchema);