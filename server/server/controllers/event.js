'use strict';

var mongoose = require('mongoose'),
    Flickr = require("flickrapi"),
    streamifier = require('streamifier'),
    Event = mongoose.model('Event'),
    EventBooking = mongoose.model('EventBooking'),
    EventLog = mongoose.model('EventLog'),
    _ = require('lodash'),
    logger = require(global.root + '/server/config/logs'),
    User= mongoose.model('User'),
    config = require(global.root + '/server/config/config');

module.exports.add = function(req, res){
    /*
    User.findOne({_id:req.user._id})
        .then(user=>{
            if(!user.events.filter(d=>d.code===req.params.eventCode).length){
                user.events.push({code:req.params.eventCode});
                return user.save()
            }
        })
        .then(()=>res.send(req.event))
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
    */
        var prom = Q();
        if(!req.user.events.filter(d=>d.code===req.params.eventCode).length){
            req.user.events.push({code:req.params.eventCode});
            prom = req.user.save()
        }
        prom.then(()=>res.send(req.event))
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};

module.exports.create = function(req, res){
    //(new Event(req.body))
    //    .save()
    //    .then(()=>User.findOne({_id: req.user._id}))
    //    .then(user=>{
    //        user.events.push({code: req.body.code});
    //        return user.save()
    //    })
    (new Event(req.body))
        .save()
        .then(()=>{
            req.user.events.push({code: req.body.code});
            return req.user.save()
        })
        .then(()=>res.send({}))
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};

module.exports.update = function(req, res){
    req.event.set(_.pick(req.body, ['starred']));
    req.event.save()
        .then(()=>res.send(req.event))
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};

module.exports.eventsPhoto = function(req, res){
    res.send({})
};

module.exports.list = function(req, res){
    User.findOne({_id:req.user._id}, '-salt -hashed_password')
        .then(user=>Event.find({code:{$in:user.events.map(d=>d.code)}}))
        .then(events=>res.send(events))
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};

module.exports.bookEvent = function(req, res){
    (new EventBooking({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        userId:req.user._id
    })).save()
        .then(()=>res.send({}))
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}

module.exports.uploadImage=function(req, res){
    var base64Data = req.body.data;
    var imageBuffer = decodeBase64Image(base64Data);
    var bufferStream = streamifier.createReadStream(imageBuffer.data);
    bufferStream.path = '-';
    var uploadOptions = {
        photos: [{
            tags: [req.body.eventCode],
            photo: bufferStream
        }]
    };
    Flickr.upload(uploadOptions, config.flickr, function(err, result) {
        if(!result.length){
            err = "request successful but could not upload picture";
        }
        if(err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

module.exports.getEventByCode=function(req, res, next, id){
    Event.findOne({
        code:id
    },function(err,record){
        if(err){
            logger.error(err);
            return res.status(500).send(err);
        }
        if(!record){
            res.status(404).send({result: "NO_RECORD"});
        }
        else{
            req.event = record;
            next();
        }
    });
};