const fs = require('fs');
const rimraf = require('rimraf');

const childProcess = require('./child-manager');

const mongoPath = '\"C:\\Program Files\\MongoDB\\Server\\4.0\\bin\\mongod.exe\" --dbpath \"F:\\MongoDB\\data\" --storageEngine=mmapv1';
const mongo = new childProcess('mongoDB', mongoPath);

mongo.beforeStart = function () {
    if (fs.existsSync('mongo-db\\mongod.lock')) {
        try {
            rimraf.sync('mongo-db\\mongod.lock')
        } catch (err) {
            console.error('delete lock error', err)
        }
    }
}

mongo.afterStop(() => {
    console.info('MongoDB stoped');
})

module.exports = mongo;
