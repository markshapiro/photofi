'use strict';

var mongoose = require('mongoose'),
    Flickr = require("flickrapi"),
    Event = mongoose.model('Event'),
    EventBooking = mongoose.model('EventBooking'),
    EventLog = mongoose.model('EventLog'),
    _ = require('lodash'),
    logger = require(global.root + '/server/config/logs'),
    cloudinary = require('cloudinary'),
    User= mongoose.model('User'),
    config = require(global.root + '/server/config/config');

    cloudinary.config(config.cloudinary);

module.exports.add = function(req, res){
    User.findOne({_id:req.user._id})
        .then(user=>{
            if(user.events.filter(d=>d.code===req.params.eventCode).length===0){
                user.events.push({code:req.params.eventCode});
                return user.save()
            }
        })
        .then(()=>{
            return res.send({});
        })
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};

module.exports.get = function(req, res){
    Event.findOne({ code:req.params.eventCode })
        .then(event=>res.send(event))
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};


module.exports.list = function(req, res){
    User.findOne({_id:req.user._id}, '-salt -hashed_password')
        .then(user=>Event.find({code:{$in:user.events.map(d=>d.code)}}, {code:1, name:1, starred:1}))
        .then(events=>res.send(events))
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};


module.exports.addPhotos = function(req, res){
    Event.update(
        { code:req.params.eventCode },
        { $push: { photos: { $each: req.body.map(el=>({url:el})) } } })
    .then(()=>{
        return res.send({});
    })
    .catch(err=>{
        logger.error(err);
        return res.status(500).send(err);
    });
};

module.exports.create = function(req, res){
    (new Event(req.body))
        .save()
        .then(()=>User.findOne({_id:req.user._id}))
        .then(user=>{
            user.events.push({code:req.body.code});
            return user.save()
        })
        .then(()=>{
            return res.send({});
        })
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};

module.exports.starPhoto = function(req, res){
    Event.update(
        { code:req.params.eventCode },
        { $set:{
            starred:req.params.phid
        }})
        .then(()=>{
            return res.send({});
        })
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};

module.exports.deletePhoto = function(req, res){
    Event.update(
        { code:req.params.eventCode },
        { $pull: { "photos":{ phid:req.params.phid  } } })
        .then(()=>{
            return res.send({});
        })
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
        .then(()=>{
            res.send({});
        })
        .catch(err=>{
            logger.error(err);
            return res.status(500).send(err);
        });
};

/**
 * get temporary credentials to upload straight to cloudinary instead of going thru server
 * @param req
 * @param res
 */
module.exports.getTempUploadCredentials=function(req, res){
    var html = cloudinary.uploader.image_upload_tag('image', {
        crop: "limit",
        width: config.maxImgSize,
        height: config.maxImgSize,
        // use_filename: true,
        //unique_filename: false
    });

    var start = html.indexOf("{");
    var end = html.indexOf("}");
    var obj = JSON.parse(html.substr(start,end-start+1))
    res.send(obj);
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
    var bufferStream = require('streamifier').createReadStream(imageBuffer.data);
    bufferStream.path = 'mustNotBeNullForSomeReason';  //<--- fixed things somehow, will check this later.
    var uploadOptions = {
        photos: [{
            title: "title",
            tags: ['tag'],
            photo: bufferStream
        }]
    };
    Flickr.upload(uploadOptions, config.flickr, function(err, result) {
        if(err) {
            return console.error(err);
        }
        res.send(result);
    });
};