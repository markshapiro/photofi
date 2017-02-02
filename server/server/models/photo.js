'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    "url": {
        type: String,
        maxlength: 70,
        required: true
    },
    "code": {
        type: String,
        maxlength: 10,
        required: true
    },
    "dateupload": {
        type: Number,
        required: true,
        integer: true
    }
});

PhotoSchema.index({code: 1, dateupload: -1});

mongoose.model('Photo', PhotoSchema);