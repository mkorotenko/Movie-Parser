'use strict';
const fs = require('fs'),
         request = require('request');

const SRC_PATH = process.env.PATH_SRC || 'src';

module.exports = function (reqImg) {

    function download(uri, filename, callback, error){
        request.head(uri, function(err, res, body){
            try {
                request(uri)
                    .pipe(fs.createWriteStream(filename))
                    .on('close', callback);
            }
            catch(e) {
                error(e);
            }
        });
    };

    function assets(img, callback, error) {
        const _img = img;//.replace('http://kinogo.cc', '');
        download(_img, 
        SRC_PATH + '/assets/images/' + _img.split('/').pop(), 
            callback, error);
    };

    return new Promise((resolve, reject) => {
        try {
            assets(reqImg, resolve, reject);
        }
        catch(e) {
            reject(e);
        }
    })

};