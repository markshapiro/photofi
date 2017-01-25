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
            eventController.get);

    app.route('/events/:eventCode/addPhotos')
        .post(
            auth.requiresLogin(true),
            eventController.addPhotos)

    app.route('/events')
        .get(
            auth.requiresLogin(true),
            eventController.list)
        .post(
            auth.requiresLogin(true),
            eventController.create);

    app.route('/events/:eventCode/star/:phid')
        .post(
            auth.requiresLogin(true),
            eventController.starPhoto);

    app.route('/events/:eventCode/delete/:phid')
        .post(
            auth.requiresLogin(true),
            eventController.deletePhoto);

    app.route('/bookEvent')
        .post(
        auth.requiresLogin(),
        eventController.bookEvent);

    app.route('/getTempUploadCredentials')
        .get(
            auth.requiresLogin(),
            eventController.getTempUploadCredentials);




    app.route('/test')
        .post(
        eventController.uploadImage);
};