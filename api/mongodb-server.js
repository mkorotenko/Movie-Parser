const fs = require('fs');
const rimraf = require('rimraf');

const childProcess = require('./child-manager');

const mongoPath = '\"D:\\Program Files\\MongoDB\\Server\\3.2\\bin\\mongod.exe\" --dbpath mongo-db --storageEngine=mmapv1';
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
