'use strict';

const mondoDB = require('mongodb');
const MongoClient = mondoDB.MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'movies_lib';

const findApplications = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('applications');
    // Find some documents
    let found = collection.find();
    found.count()
        .then(length => {
            found.toArray(function(err, docs) {
              callback({
                  count: length,
                  docs
                });
            });
        })
}

const findDocuments = function(collection, filter, limits) {
    return new Promise((resolve, reject) => {
        let found = collection.find(filter).sort({ rating: -1 });
        found.count()
            .then(length => {
                if (limits && limits.skip) {
                    found = found.skip(limits.skip);
                }
                if (limits && limits.limit) {
                    found = found.limit(limits.limit);
                }
            
                found.toArray(function(err, docs) {
                    resolve({
                      count: length,
                      docs
                    });
                });
            })
            .catch(() => reject());
        });
}

function getFilterVal(keyOp, val) {
    switch (keyOp[0]) {
        case 'year':
            val = val.split(',').map(v => parseFloat(v));
        break;
    }

    if (keyOp.length === 1) {
        if (typeof val === 'string') {
            return val;
        }
        else if (val.length === 1) {
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

    getDocuments: function(collectionName, query) {
        return new Promise((resolve, reject) => {

            MongoClient.connect(url, function (err, client) {

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

                findDocuments(db.collection(collectionName), filter, limits)
                    .then((docs) => {
                        client.close();
                        resolve({...docs, filter: filter});
                    })
                    .catch((err) => {
                        client.close();
                        reject(err);
                    });

            });    
        })
    },

    insertDocuments: function(collectionName, query) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
    
                const db = client.db(dbName);
                // Get the documents collection
                const _collection = db.collection(collectionName);
                // Insert some documents

                query.forEach(doc => {
                    if (doc._id)
                        delete doc._id;
                });

                _collection.insertMany(query)
                .then((res) => {
                    client.close();
                    resolve(res);
                })
                .catch(err => {
                    client.close();
                    reject(err);
                });

            });
        })
    },

    putDocuments: function(collectionName, query) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
    
                const db = client.db(dbName);
                // Get the documents collection
                const _collection = db.collection(collectionName);
                // Put some documents

                let promises = query.map(doc => {
                    // let doc_data = Object.assign({}, doc);
                    // delete doc_data._id;
                    doc._id = mondoDB.ObjectId(doc._id);
                    return _collection.replaceOne(
                        { _id : doc._id },
                        doc
                    );
                });
                
                Promise.all(promises)
                    .then((res) => {
                        client.close();
                        resolve(res);
                    })
                    .catch(err => {
                        client.close();
                        reject(err);
                    });
    
            });
        })
    },

    deleteDocuments: function(collectionName, query) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
    
                const db = client.db(dbName);
                // Get the documents collection
                const _collection = db.collection(collectionName);
                // Delete some documents

                let promises = Object.keys(query).map(key =>
                    _collection.deleteOne({ _id : mondoDB.ObjectId(query[key])})
                );
                
                Promise.all(promises)
                    .then((res) => {
                        client.close();
                        resolve(res);
                    })
                    .catch(err => {
                        client.close();
                        reject(err);
                    });
    
            });
        })
    },

    getApplications: function() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {

                if (err) {
                    reject(err);
                    return;
                }

                const db = client.db(dbName);

                findApplications(db, function (docs) {
                    client.close();
                    resolve(docs);
                });

            });    
        })
    },

    insertMovies: function(collection) {
        MongoClient.connect(url, function (err, client) {
            const db = client.db(dbName);
            insertDocuments(db, collection, function () {
                client.close();
            });
        });
    },

    updateMovie: async function(id, data) {
        let client = await MongoClient.connect(url);//, function (err, client) {

        const db = client.db(dbName);
        // Get the documents collection
        const collection = db.collection('documents');
        // Insert some documents
        await collection.update({ "_id": mondoDB.ObjectId(id) }, { $set: data });
        client.close();

        //});
    },
    
    findMovies: function(query) {
        return new Promise((resolve, reject) => {

            MongoClient.connect(url, function (err, client) {

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

                findDocuments(db.collection('documents'), filter, limits)
                    .then((docs) => {
                        client.close();
                        resolve({...docs, filter: filter});
                    })
                    .catch((err) => {
                        client.close();
                        reject(err);
                    });

            });    
        })
    },

    putMovies: function(query) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
    
                const db = client.db(dbName);
                // Get the documents collection
                const collection = db.collection('documents');
                // Put some documents

                let promises = query.map(doc => {
                    let doc_data = Object.assign({}, doc);
                    delete doc_data._id;
                    return collection.replaceOne(
                        {"_id" : mondoDB.ObjectId(doc._id)},
                        doc_data
                    );
                });
                
                Promise.all(promises)
                    .then((res) => {
                        client.close();
                        resolve(res);
                    })
                    .catch(err => {
                        client.close();
                        reject(err);
                    });
    
            });
        })
    },

    deleteMovies: function(query) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
    
                const db = client.db(dbName);
                // Get the documents collection
                const collection = db.collection('documents');
                // Delete some documents

                let promises = Object.keys(query).map(key =>
                    collection.deleteOne({"_id" : mondoDB.ObjectId(query[key])})
                );
                
                Promise.all(promises)
                    .then((res) => {
                        client.close();
                        resolve(res);
                    })
                    .catch(err => {
                        client.close();
                        reject(err);
                    });
    
            });
        })
    },

    getMovie: function(id) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {

                if (err) {
                    reject(err);
                    return;
                }

                const db = client.db(dbName);

                const filter = {"_id" : mondoDB.ObjectId(id)};
                const limits = {};

                findDocuments(db.collection('documents'), filter, limits)
                    .then((res) => {
                        client.close();
                        resolve(res.docs);
                    })
                    .catch((err) => {
                        client.close();
                        reject(err);
                    });
            });    

        })
    },

    updateParser: function(query) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
    
                const db = client.db(dbName);
                // Get the documents collection
                const collection = db.collection('parsers');
                // Insert some documents

                if (query._id)
                    delete query._id;

                collection.update({ url: query.url }, { $set: { listParser: query.listParser, parser: query.parser } })
                    .then(res => {
                        client.close();
                        resolve(res);
                    })
                    .catch(err => {
                        client.close();
                        reject(err);
                    });
            });
        })
    },

    getParser: function(query) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {

                if (err) {
                    reject(err);
                    return;
                }

                const db = client.db(dbName);

                findDocuments(db.collection('parsers'), query)
                    .then((res) => {
                        client.close();
                        resolve(res.docs[0]);
                    })
                    .catch((err) => {
                        client.close();
                        reject(err);
                    });
            });    

        })
    },

};