'use strict';

var eventController = require(global.root+'/server/controllers/event.js'),
    passport = require("passport"),
    auth = require(global.root+'/server/config/middlewares/authorization');

module.exports = function(app) {

    app.route('/event/:eventCode/add')
        .post(
            auth.requiresLogin(),
            eventController.add);

    app.route('/event/:eventCode')
        .put(
            auth.requiresLogin(true),
            auth.requiresEventOwnership(),
            eventController.update);

    app.route('/event')
        .get(
            auth.requiresLogin(),
            eventController.list)
        .post(
            auth.requiresLogin(true),
            eventController.create);

    app.route('/bookEvent')
        .post(
            auth.requiresLogin(),
            eventController.bookEvent);

    app.route('/event/:eventCode/upload')
        .post(
            auth.requiresLogin(true),
            auth.requiresEventOwnership(),
            eventController.uploadImage);

    app.param('eventCode',eventController.getEventByCode);
};