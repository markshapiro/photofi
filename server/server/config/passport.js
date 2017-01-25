var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    config = require('./config'),
    logger = require(global.root + '/server/config/logs'),
    User = mongoose.model('User'),
    passport = require('passport');

module.exports = function() {

    passport.serializeUser(function (user, done) {
        done(null,user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use('user-regular-strategy',new LocalStrategy({
            usernameField: 'name',
            passwordField: 'password'
        },
        function(name, password, done) {
            User.findOne({name}, function(err, account) {
                if (err) {
                    logger.error(err);
                    return done(err);
                }
                if (!account) {
                    return done(null, false, {
                        result: 'UNKNOWN_USER'
                    });
                }
                if (!account.authenticate(password)) {
                    return done(null, false, {
                        result: 'INVALID_PASSWORD'
                    });
                }
                return done(null, account);
            });
        }
    ));
};