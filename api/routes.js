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

const SRC_PATH = process.env.PATH_SRC || 'd:/server_root/dist';

const getCollectionName = function(req) {
    let collectionName = 'documents';
    if (req.params) {
        if (req.params[0])
            collectionName = req.params[0];
    };
    return collectionName;
}

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
                .catch(err => res.json(err))
        },

        "documents/*": function (req, res) {
            db.getDocuments(getCollectionName(req), req.query || { till: 20 })
                .then(docs => res.json(docs))
                .catch(err => res.json(err))
        },

        "parser": function (req, res) {
            db.getParser(req.query)
                .then(parser => res.json(parser))
                .catch(err => res.json(err))
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
                                res.json({
                                    file: imgSrc,
                                    error: e
                                });
                            })
                    }
                })
        },

        "content": function (req, res) {
            const sourceParser = require('./sourceParser');
            const iconv = require('iconv-lite');

            function getSourceData(url) {
                return new Promise((resolve, reject) => {

                    httpClient.get(url, (resp) => {
                        var chunks = [];
        
                        resp.on('data', (chunk) => chunks.push(chunk));
        
                        resp.on('end', () => {
                            const data = Buffer.concat(chunks);
                            const html = iconv.decode(data, 'win1251');

                            resolve(html);
                        });
        
                    }).on("error", (err) => {
                        console.log("Error: " + err.errno);
                        reject(err.errno);
                    });
                })
            }

            let params = '';
            if (req.query && req.query.page) {
                params = 'page/' + req.query.page + '/';
            }

            let parser = db.getParser(req.query.url);
            let source = getSourceData('http://kinogo.cc/' + params);
            Promise.all([source, parser]).then(([html, docParser]) => {

                    const collection = sourceParser(html, docParser.listParser)
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

                            res.json({new: toInsert, count: collection.length});
                        })
                        .catch(e => {
                            console.info('found err', e);
                            res.json(e);
                        })
                })
                .catch(err => res.json(err))

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

        },

        "sources": function (req, res) {
            db.getDocuments('parsers', req.query || { till: 20 })
                .then(result => {
                    let sources = result.docs.map(s => ({ value: s.url, description: s.description || '' }));
                    res.json(sources);
                })
                .catch(err => res.json(err))
        }

    };

    let post = {

        "parser": function(req, res) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let data = JSON.parse(body);
                db.updateParser(data)
                    .then(result => res.json(result))
                    .catch(err => res.json(err));
            });
        },

        "documents/*": function(req, res) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let data = JSON.parse(body);
                db.insertDocuments(getCollectionName(req), data)
                    .then(result => res.json(result))
                    .catch(err => res.json(err));
            });
        }

    };

    let put = {

        "movies": function (req, res) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let data = JSON.parse(body);
                db.putMovies(data)
                    .then(result => res.json(result))
                    .catch(e => res.json(e))
            });
        },

        "documents/*": function (req, res) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let data = JSON.parse(body);
                db.putDocuments(getCollectionName(req), data)
                    .then(result => res.json(result))
                    .catch(e => res.json(e))
            });
        }

    };

    let del = {

        "movies": function (req, res) {
            db.deleteMovies(req.query)
                .then(result => res.json(result))
                .catch(e => res.json(e))
        },

        "documents/*": function (req, res) {
            db.deleteDocuments(getCollectionName(req), req.query)
                .then(result => res.json(result))
                .catch(e => res.json(e))
        }

    };

    addRoutesMethods({ get }, 'acc');
    addRoutesMethods({ post }, 'acc');
    addRoutesMethods({ put: put }, 'acc');
    addRoutesMethods({ delete: del }, 'acc');

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