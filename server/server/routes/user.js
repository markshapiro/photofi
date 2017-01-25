'use strict';

var userController = require(global.root+'/server/controllers/user.js'),
    auth = require(global.root + '/server/config/middlewares/authorization'),
    passport = require("passport");

module.exports = function(app) {

    app.route('/user/login')
        .post(
            passport.authenticate('user-regular-strategy'),
            userController.login);

    app.route('/user/register')
        .post(
            userController.register);
};