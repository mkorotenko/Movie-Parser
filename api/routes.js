'use strict';

const db = require('./db'),
      fs = require('fs'),
      path = require('path'),
      bodyParser = require('body-parser'),
      imgLoader = require('./imageLoader');
    
const httpClient = require('http');
// Allowed extensions list can be extended depending on your own needs
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];

const SRC_PATH = process.env.PATH_SRC || 'src';

module.exports = function (app) {

    function addRoutesMethods(module, controllerName) {
        for (let route in module.get)
            app.route('/api/' + controllerName + '/' + route)
                .get(module.get[route]);

        for (let route in module.post)
            app.route('/api/' + controllerName + '/' + route)
                .post(module.post[route]);

        for (let route in module.put)
            app.route('/api/' + controllerName + '/' + route)
                .put(module.put[route]);

        for (let route in module.delete)
            app.route('/api/' + controllerName + '/' + route)
                .delete(module.delete[route]);
    }

    let get = {

        "assets": function (req, res) {
            imgLoader(req.query.img)
                .then(() => res.json(true))
                .catch((e) => res.json(e))
        },

        "movies": function (req, res) {
            db.findMovies(req.query || { till: 20 })
                .then(movies => res.json(movies))
                .catch(e => res.json(e))
        },

        "image/*": function(req, res) {
            const docID = req.url.split('/').pop();
            db.getMovie(docID)
                .then(m => {
                    const imgSrc = m[0].imgSrc;
                    const fileName = SRC_PATH + '/assets/images/' + imgSrc.split('/').pop();
                    if (fs.existsSync(fileName)) {
                        res.sendFile(path.resolve(fileName));
                    } else {
                        imgLoader(imgSrc)
                            .then(function() {
                                res.sendFile(path.resolve(fileName));
                            })
                            .catch(function(e) {
                                res.json(e);
                            })
                    }
                })
        },

        "content": function (req, res) {
            const kinogoParser = require('./kinogo');
            const iconv = require('iconv-lite');

            let params = '';
            if (req.query && req.query.page) {
                params = 'page/' + req.query.page + '/';
            }

            httpClient.get('http://kinogo.cc/' + params, (resp) => {
                var chunks = [];

                resp.on('data', (chunk) => chunks.push(chunk));

                resp.on('end', () => {
                    const data = Buffer.concat(chunks);
                    const html = iconv.decode(data, 'win1251');
                    const collection = kinogoParser(html)
                        .filter(i => !i.details.Country.includes("Россия"));

                    const tasks = collection.map(movie => db.findMovies({ 
                        title: movie.title 
                    }));

                    Promise.all(tasks)
                        .then(function(values) {
                            const toInsert = values
                                .filter(d => !d.count)
                                .map(d => collection.find(c => c.title == d.filter.title));

                            if (toInsert && toInsert.length)
                                db.insertMovies(toInsert);

                            res.json({new: toInsert.length, count: collection.length});
                        })
                        .catch(e => {
                            console.info('found err', e);
                            res.json(e);
                        })
                });

            }).on("error", (err) => console.log("Error: " + err.message));

        },

        "moviePath/*": function (req, res) {

            const kinogoParser = require('./kinogo.movie');
            const docID = req.url.split('/').pop();
            db.getMovie(docID)
                .then(m => {
                    // if (m[0].movie && m[0].movie.length)
                    //     res.json(m[0].movie);
                    // else 
                        httpClient.get(m[0].href, (resp) => {
                            var chunks = [];
            
                            resp.on('data', (chunk) => chunks.push(chunk));
            
                            resp.on('end', () => {
                                const data = Buffer.concat(chunks);
                                const collection = kinogoParser(data);
                                if (collection && collection.length)
                                    db.updateMovie(m[0]._id, { movie: collection });
            
                                res.json(collection);
                            });
            
                        }).on("error", (err) => {
                            console.log("Error: " + err.message);
                        });
                });

        }
    };

    addRoutesMethods({ get }, 'acc');

    app.get('*', (req, res) => {
        if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
            if (req.url.indexOf('assets/images') > 0) {
                if (fs.existsSync(`src${req.url}`)) {
                    res.sendFile(path.resolve(`src${req.url}`));
                } else {
                    imgLoader(req.url)
                        .then(function() {
                            res.sendFile(path.resolve(`src${req.url}`));
                        })
                        .catch(function(e) {
                            res.json(e);
                        })
                }
            } else
                res.sendFile(path.resolve(`dist${req.url}`));
        } else {
            res.sendFile(path.resolve('dist/index.html'));
        }
    });
    
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.raw({ limit: '50mb' }));
    app.use(bodyParser.text({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }));

};