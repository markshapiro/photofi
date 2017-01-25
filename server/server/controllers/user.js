'use strict';

var mongoose = require('mongoose'),
    User= mongoose.model('User'),
    Event = mongoose.model('Event'),
    EventLog = mongoose.model('EventLog'),
    _ = require('lodash'),
    logger = require(global.root + '/server/config/logs');

module.exports.login = function(req, res){
    (new EventLog({
        userId:req.user._id,
        data:"login"
    })).save()
        .then(()=>{
            res.send(req.user);
        })
        .catch(err=>{
            return res.status(500).send(err);
        });
};

module.exports.register = function(req, res){
    User.findOne({$or:[
        {email:req.body.email},
        {name:req.body.name}]}, '-salt -hashed_password')
        .then(customer=>{
            if(customer) throw "USER_EXISTS";
            return (new User(req.body)).save()
        })
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        })
        .then((user)=>{
            req.logIn(user, function(err) {
                if(err){
                    logger.error(err);
                    return res.status(500).send(err);
                }
                res.send(user);
            });
        });
};
