'use strict';

const mondoDB = require('mongodb');
const MongoClient = mondoDB.MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'movies_lib';

const findDocuments = function(db, filter, limits, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Find some documents
    let found = collection.find(filter);
    found.count()
        .then(length => {
            if (limits.skip) {
                found = found.skip(limits.skip);
            }
            if (limits.limit) {
                found = found.limit(limits.limit);
            }
        
            found.toArray(function(err, docs) {
              callback({
                  count: length,
                  docs
                });
            });
        })
}

function getFilterVal(keyOp, val) {
    if (keyOp.length === 1) {
        if (val.length === 1) {
            return val[0]
        } else {
            return { '$in' : val }
        }
    } else {
        const op = keyOp[1];
        switch (op) {
            case 'gt': 
                return { '$gte': parseFloat(val) }
            case 'ls': 
                return { '$lte': parseFloat(val) }
            case 'or': 
                return { '$in': val }
            case 'ex':
                return { '$regex' : `.*${val}.*`, '$options': 'i' }
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
            //console.log("Connected successfully to server");

            const db = client.db(dbName);
            insertDocuments(db, collection, function () {
                client.close();
            });
        });
    },

    updateMovie: function(id, data) {
        MongoClient.connect(url, function (err, client) {
            //console.log("Connected successfully to server");

            const db = client.db(dbName);
            // Get the documents collection
            const collection = db.collection('documents');
            // Insert some documents
            collection.update({"_id" : mondoDB.ObjectId(id)}, { $set: data });
            client.close();

        });
    },
    
    findMovies: function(query) {
        return new Promise((resolve, reject) => {

            MongoClient.connect(url, function (err, client) {
                //console.log("Connected correctly to server");

                if (err) {
                    reject(err);
                    return;
                }

                const db = client.db(dbName);

                const filter = {};
                const limits = {};
                if (query) {
                    Object.keys(query).forEach(key => {
                        if (key !== 'from' && key !== 'till') {
                            const keyOp = key.split('_');
                            const val = query[key];
                            filter[keyOp[0]] = getFilterVal(keyOp, val);
                        }
                    });
                    if (query.from) {
                        limits['skip'] = Number(query.from);
                    }
                    if (query.till) {
                        limits['limit'] = Number(query.till);
                    }
                }

                findDocuments(db, filter, limits, function (docs) {
                    client.close();
                    resolve(docs);
                });

            });    
        })
    },

    getMovie: function(id) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
                //console.log("Connected correctly to server");

                if (err) {
                    reject(err);
                    return;
                }

                const db = client.db(dbName);

                const filter = {"_id" : mondoDB.ObjectId(id)};
                const limits = {};

                findDocuments(db, filter, limits, function (res) {
                    client.close();
                    resolve(res.docs);
                });

            });    

        })
    }
};