
var express = require('express'),
    config = require('./config'),
    flash = require('connect-flash'),
    logger = require(global.root + '/server/config/logs'),
    passport = require('passport');

module.exports = function(app, dbConn) {

    app.set('showStackError', true);

    var compression = require('compression');

    //Should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    app.use('/',express.static(global.root + '/public'));

    global.cookieParser=require('cookie-parser')(config.session.secret);

    app.use(global.cookieParser)

    app.use(require('body-parser').json({limit:'1mb'}));

    app.use(require('method-override')())

    var session = require('express-session');

    var mongoStore = require('connect-mongo')({
        session: session
    });

    global.sessionStorage  = new mongoStore({
        mongooseConnection: dbConn,
        ttl: config.session.maxAge,
        collection: config.session.collection,
        touchAfter: 3 * 3600
    });

    app.use(session({
        secret: config.session.secret,
        store: global.sessionStorage
    }));

    app.use(flash());

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(passport.authenticate('remember-me'));

    //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function(err, req, res, next) {
        //Treat as 404
        if (~err.message) return next();

        //Log it
        logger.error(err.stack);

        //Error page
        res.status(500).render('500', {
            message: err.stack
        });
    });
};
