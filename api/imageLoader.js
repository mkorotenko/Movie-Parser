'use strict';
const fs = require('fs'),
         request = require('request');

module.exports = function (reqImg) {

    function download(uri, filename, callback){
        request.head(uri, function(err, res, body){
            request(uri)
                .pipe(fs.createWriteStream(filename))
                .on('close', callback);
        });
    };

    function assets(img, callback) {
        download('http://kinogo.cc' + img, 'src/assets/images/' + img.split('/').pop(), callback);
    };

    return new Promise((resolve, reject) => {
        try {
            assets(reqImg, resolve);
        }
        catch(e) {
            reject(e);
        }
    })

};