'use strict';

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'movies_lib';

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

const insertDocuments = function (db, data, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany(data, function (err, result) {
        callback && callback(result);
    });
}

module.exports = {

    insertMovies: function(collection) {
        MongoClient.connect(url, function (err, client) {
            console.log("Connected successfully to server");

            const db = client.db(dbName);
            insertDocuments(db, collection, function () {
                client.close();
            });
        });
    },

    findMovies: function(req) {
        return new Promise((resolve, reject) => {

            MongoClient.connect(url, function (err, client) {
                console.log("Connected correctly to server");

                if (err) {
                    reject(err);
                    return;
                }

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
                    resolve(docs);
                });

            });    
        })
    }

};