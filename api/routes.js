'use strict';

const db = require('./db'),
      fs = require('fs'),
      path = require('path'),
      bodyParser = require('body-parser'),
      imgLoader = require('./imageLoader');

const serializeError = require('serialize-error');
const sourceParser = require('./sourceParser');

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

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';

const SRC_PATH = process.env.PATH_SRC || 'd:/server_root/dist';

const getCollectionName = function(req) {
    let collectionName = 'documents';
    if (req.params) {
        if (req.params[0])
            collectionName = req.params[0];
    };
    return collectionName;
}
    
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
        .on("error", (err) => {
            console.log("Error: " + err.errno);
            reject(err.errno);
        });
    })
}

function loadJSON(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => resolve(JSON.parse(body)));
        req.on('error', err => reject(err));
    })
}

async function parseSource(req) {

    let params = '';
    if (req.query && req.query.page) {
        params = 'page/' + req.query.page + '/';
    }

    let data = {}
    if (req.method !== "GET") {
        data = await loadJSON(req);
    }

    const docParser = await db.getParser({ url: req.query.url });

    const html = await _getSourceData('http://' + docParser.url + '/' + params, docParser.coding);

    const rawCollection = await sourceParser.list(html, data.listParser || docParser.listParser);

    const collection = rawCollection
        .filter(i => !i.details.Country.includes("Россия"));

    await Promise.all(collection.map(async (doc) => {
        const _html = await _getSourceData(doc.href, docParser.coding);
        await sourceParser.details(_html, doc, data.parser || docParser.parser);
    }));

    return collection;

};

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
            parseSource(req)
                .then(list => {
                    const collection = list;
            
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
                        //res.json({ result: list })
                })
                .catch(error => {
                    res.set('Content-Type', 'application/json; charset=utf-8')
                    res.send(serializeError(error));                    
                });

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
            
                    db.updateMovie(doc._id, { movie: doc.movie });
                    res.json(doc.movie);

                })
                .catch(error => {
                    res.set('Content-Type', 'application/json; charset=utf-8');
                    res.code(500);
                    res.send(serializeError(error));                    
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

        "parserTest": function(req, res) {
            parseSource(req)
                .then(list => res.json({ result: list }))
                .catch(error => {
                    res.set('Content-Type', 'application/json; charset=utf-8')
                    res.send(serializeError(error));                    
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