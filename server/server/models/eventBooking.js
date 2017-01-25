'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var EventBookingSchema = new Schema({
    "email": {
        type: String,
        maxlength: 30,
        required: true
    },
    "name": {
        type: String,
        maxlength: 20,
        required: true
    },
    "phone": {
        type: String,
        maxlength: 20,
        required: true
    },
    "userId": {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    "isPhotographer": {
        type: Boolean,
        default:false,
        required: true
    },
});

mongoose.model('EventBooking', EventBookingSchema);