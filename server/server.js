
var express = require('express'),
    fs = require('fs'),
    events = require('events'),
    http = require("http"),
    config = require('./server/config/config'),
    mongoose = require('mongoose');

//global variables
global.root= require('path').normalize(__dirname);

//Load configurations
//if test env, load example file
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var logger = require(global.root + '/server/config/logs');

//Bootstrap db connection
var db = mongoose.connect(config.db);
var dbConn = mongoose.connection;
mongoose.Promise = require('q').Promise;

//init models
require('./server/config/modelsInit')(__dirname + '/server/models');

//bootstrap passport config
require('./server/config/passport')();

var app = express();

var server = http.createServer(app);

dbConn.on('error', function () {
    throw {
        name: 'dbConnectionError',
        message: 'Unable to connect to DB'
    };
});

dbConn.once('open', function callback() {

    require('./server/config/beforeServerStart')(app, server)
        .then(()=>{
            //init express
            require('./server/config/express')(app, dbConn);

            //Bootstrap routes
            require('./server/routes/routes')(app);

            //Start the app by listening on <port>
            var port = process.env.PORT || config.port;

            server.listen(port);

            logger.info('Express app started on port ' + port);
        })
        .catch(err=>{
            logger.error(err);
        });
});
