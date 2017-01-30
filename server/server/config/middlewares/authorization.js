'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.requiresLogin = function(isPhotographer){
    return function(req, res, next) {
        if (!req.isAuthenticated() && (!isPhotographer || (isPhotographer && req.user && req.user.isPhotographer))) {
            return res.status(401).send('User is not authorized');
        }
        next();
    }
};

exports.requiresEventOwnership = function(){
    return function(req, res, next) {
        const code = req.event && req.event.code;
        User.findOne({_id: req.user && req.user._id})
            .then(user=>{
                if(user.events.filter(d=>d.code === code).length){
                    return next();
                }
                throw 'User is not authorized';
            })
            .catch(err=>res.status(401).send(err));
    }
};
