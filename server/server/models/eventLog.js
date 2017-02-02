'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventLogSchema = new Schema({
    "userId": {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    "data": Schema.Types.Mixed,
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

mongoose.model('EventLog', EventLogSchema);