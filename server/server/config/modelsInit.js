'use strict';

(function(){
    var fs = require('fs');

    module.exports = function modelsInit(path) {
        fs.readdirSync(path).forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);
            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)$/.test(file)) {
                    require(newPath);
                }
            } else if (stat.isDirectory()) {
                modelsInit(newPath);
            }
        });
    };
})();
