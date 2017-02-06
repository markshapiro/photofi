var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    config = require('./config'),
    logger = require(global.root + '/server/config/logs'),
    User = mongoose.model('User'),
    needle = require('needle'),
    passport = require('passport');

module.exports = function() {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use('user-regular-strategy',new LocalStrategy({
            usernameField: 'name',
            passwordField: 'password'
        },
        function(name, password, done) {
            User.findOne({name, fbid:null}, function(err, account) {
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

    passport.use('user-facebook-strategy',new LocalStrategy({
        usernameField: 'fbid',
        passwordField: 'accessToken'
    },
    function(fbid, accessToken, done) {
        var theUrl = "https://graph.facebook.com/me?access_token=" + accessToken;
        needle.get(theUrl, function (e, r, body) {
            if (body && body.id === fbid) {         //verify user id from fb data same as given user id
                return User.findOne({fbid})
                    .then(user=>{
                        if(!user){
                            var name = "fb"+(new Date()).getTime();
                            return (new User({fbid, name, email:name+"@photofi.co.il", password:""})).save();
                        }
                        return user
                    })
                    .then(user=>done(null, user))
                    .catch(err=>done(null, err));
            }
            return done(null,false,'INVALID_FB_TOKEN');
        });
    }));
};