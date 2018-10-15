'use strict';

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'movies_lib';

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

    const insertDocuments = function (db, data, callback) {
        // Get the documents collection
        const collection = db.collection('documents');
        // Insert some documents
        collection.insertMany(data, function (err, result) {
            callback && callback(result);
        });
    }

    let get = {
        Login: function (req, res) {
            res.json({
                success: true,
                sessID: "yn4scf1mw3qr2nlthkv3eulh",
                returnUrl: null
            });
        },

        movies: function (req, res) {
            const findDocuments = function(db, filter, limits, callback) {
                // Get the documents collection
                const collection = db.collection('documents');
                // Find some documents
                let found = collection.find(filter);
                if (limits.skip) {
                    found = found.skip(limits.skip);
                }
                if (limits.limit) {
                    found = found.limit(limits.limit);
                }

                found.toArray(function(err, docs) {
                  callback(docs);
                });
              }

            function getFilterVal(keyOp, val) {
                if (keyOp.length === 1) {
                    if (val.length === 1) {
                        return val[0]
                    }
                    else {
                        return { '$in' : val }
                    }
                } else {
                    const op = keyOp[1];
                    switch (op) {
                        case 'gt': 
                            return { '$gte': parseFloat(val[0]) }
                        case 'ls': 
                            return { '$lte': parseFloat(val[0]) }
                        case 'or': 
                            return { '$in': val }
                    }
                }
            }

            MongoClient.connect(url, function (err, client) {
                console.log("Connected correctly to server");

                const db = client.db(dbName);

                const filter = {};
                const limits = {};
                if (req.query) {
                    Object.keys(req.query).forEach(key => {
                        if (key !== 'from' && key !== 'till') {
                            const keyOp = key.split('_');
                            const val = req.query[key].split(',');
                            filter[keyOp[0]] = getFilterVal(keyOp, val);
                        }
                    });
                    if (req.query.from) {
                        limits['skip'] = Number(req.query.from);
                    }
                    if (req.query.till) {
                        limits['limit'] = Number(req.query.till);
                    }
                }

                findDocuments(db, filter, limits, function (docs) {
                    client.close();
                    res.json(docs);
                });

            });
        },

        content: function (req, res) {
            const httpClient = require('http');
            const kinogoParser = require('./kinogo');

            let params = '';
            if (req.query && req.query.page) {
                params = 'page/' + req.query.page + '/';
            }

            httpClient.get('http://kinogo.cc/' + params, (resp) => {
                var chunks = [];

                resp.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                resp.on('end', () => {
                    const data = Buffer.concat(chunks);
                    const collection = kinogoParser(data);
                    MongoClient.connect(url, function (err, client) {
                        console.log("Connected successfully to server");

                        const db = client.db(dbName);
                        insertDocuments(db, collection, function () {
                            client.close();
                        });
                    });
                    res.json(collection.length);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });

        }
    };

    addRoutesMethods({ get }, 'acc');
};