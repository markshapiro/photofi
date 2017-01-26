'use strict';

var eventController = require(global.root+'/server/controllers/event.js'),
    passport = require("passport"),
    auth = require(global.root+'/server/config/middlewares/authorization');

module.exports = function(app) {

    app.route('/events/:eventCode/add')
        .post(
            auth.requiresLogin(),
            eventController.add);

    app.route('/events/:eventCode')
        .get(
            auth.requiresLogin(),
            eventController.get)
        .put(
            auth.requiresLogin(true),
            eventController.update);

    app.route('/events')
        .get(
            auth.requiresLogin(true),
            eventController.list)
        .post(
            auth.requiresLogin(true),
            eventController.create);

    app.route('/eventsPhoto')
        .post(
            auth.requiresLogin(true),
            eventController.eventsPhoto);

    app.route('/bookEvent')
        .post(
            auth.requiresLogin(),
            eventController.bookEvent);

    app.route('/uploadImage')
        .post(
            eventController.uploadImage);

    app.param('eventCode',eventController.getEventByCode);
};