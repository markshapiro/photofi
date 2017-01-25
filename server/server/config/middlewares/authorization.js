var _ = require('lodash');

exports.requiresLogin = function(isPhotographer){
    return function(req, res, next) {
        if (!req.isAuthenticated() && (!isPhotographer || (isPhotographer && req.user.isPhotographer))) {
            return res.status(401).send('User is not authorized');
        }
        next();
    }
};
