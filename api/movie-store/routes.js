'use strict';

const db = require('../db'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    imgLoader = require('./imageLoader'),
    serializeError = require('serialize-error'),
    sourceParser = require('../sourceParser');

const httpClient = require('http');
// Allowed extensions list can be extended depending on your own needs
const allowedExt = [
    '.js', '.ico', '.css', '.png', '.jpg',
    '.woff2', '.woff', '.ttf', '.svg',
];

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';

const SRC_PATH = process.env.PATH_SRC || 'd:/movie-store/dist';
    
function _getSourceData(url, coding) {
    const iconv = require('iconv-lite');
    return new Promise((resolve, reject) => {

        httpClient.get(url, { headers: { 'User-Agent': USER_AGENT } }, (resp) => {
            var chunks = [];

            resp.on('data', (chunk) => chunks.push(chunk));

            resp.on('end', () => {
                const data = Buffer.concat(chunks);
                const html = iconv.decode(data, coding || 'utf8');

                resolve(html);
            });

        })
        .on("error", (error) => {
            reject(error);
        });
    })
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
                                if (fs.existsSync(fileName))
                                    res.sendFile(path.resolve(fileName));
                                else {
                                    res.statusCode = 404;
                                    res.send();
                                }
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

        "moviePath/*": function (req, res) {

            const pathParts = req.url.split('/');
            const docID = pathParts.pop();

            db.getMovie(docID)
                .then(async (_doc) => {

                    if (!_doc || !_doc.length)
                        throw { message: 'Doc by id "' + docID + '" not found.' }

                    let doc = _doc[0];

                    // if (doc.movie) {
                    //     res.json(doc.movie);
                    //     return;
                    // }

                    const docParser = await db.getParser({ url: doc.href.split('/')[2] });

                    const _html = await _getSourceData(doc.href, docParser.coding)
                    sourceParser.details(_html, doc, docParser.parser);
            
                    await db.updateMovie(doc._id, { movie: doc.movies });
                    res.json(doc.movies);

                })
                .catch(error => {
                    res.set('Content-Type', 'application/json; charset=utf-8');
                    res.statusCode = 500;
                    res.send(serializeError(error));                    
                });

        },

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