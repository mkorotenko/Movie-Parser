const fs = require('fs');

const childProcess = require('./child-manager');

const thread = new childProcess(
    'Thread #1',
    'node \"d:\\movie-store\\api\\dist-server.js\"',
    {
        cwd: 'd:/movie-store/'
    }
    );

thread.beforeStart = function () {
    // if (fs.existsSync('mongo-db\\mongod.lock')) {
    //     try {
    //         rimraf.sync('mongo-db\\mongod.lock')
    //     } catch (err) {
    //         console.error('delete lock error', err)
    //     }
    // }
}

thread.afterStop(() => {
    // console.info('MongoDB stoped');
})

module.exports = thread;
