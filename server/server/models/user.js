'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({

    "email": {
        type: String,
        index: true,
        maxlength: 30,
        required: true
    },
    "name": {
        type: String,
        index: true,
        maxlength: 20,
        required: true
    },
    "events":[
        {
            code:{
                type: String,
                maxlength: 10,
                required: true
            },
            created: {
                type: Date,
                required: false,
                default: Date.now
            }
        }
    ],
    "hashed_password": {
        type: String,
        maxlength: 200
    },
    salt: {
        type: String
    },
    created: {
        type: Date,
        required: false,
        default: Date.now
    }
});

UserSchema.virtual('password').set(function (password) {
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function () {
    return this.hashed_password;
});

UserSchema.methods = {
    authenticate: function (plainText) {

        return this.encryptPassword(plainText) === this.password;
    },
    encryptPassword: function (password) {
        if (!password) return '';
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    },
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    }
};

UserSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.hashed_password;
        delete ret.salt;
        return ret;
    }
});

mongoose.model('User', UserSchema);