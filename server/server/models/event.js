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
    "starred": Schema.Types.Mixed,
    created: {
        type: Date,
        required: false,
        default: Date.now
    }
});

mongoose.model('Event', EventSchema);