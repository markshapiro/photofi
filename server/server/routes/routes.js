
var express = require('express');

module.exports = function(app) {
    var router  = express.Router();
    app.use('/api', router);

    require('./user')(router);
    require('./event')(router);
};