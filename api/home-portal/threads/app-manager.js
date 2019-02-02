const mongo = require('./mongodb-server'),
    thread = require('./application-thread'),
    db = require('../../db');

module.exports = function (io) {
    if (process.env.MONGO_DB) {
        let _onExit = mongo.onExit;
        mongo.onExit = function(code) {
            console.info('Mongo stoped with code:', code);
            io.emit('broadcast','Mongo stoped with code:' + code)
            if (_onExit)
                _onExit.call(mongo, code);

            if (code !== 48 && code !== 100) {
                setTimeout(() => {
                    console.info('Mongo restarting...');
                    io.emit('broadcast','Mongo restarting...')
                    mongo.run();
                }, 10000);
            }
        }
        mongo.run();
    }

    thread.onExit = function(code) {
        console.info('Thread #1 stoped with code:', code);
        io.emit('broadcast','Thread #1 stoped with code:' + code)
    };

    //thread.run();
    
    db.getApplications()
        .then(data => {
            io.emit('broadcast', 'Get applications success: ' + JSON.stringify(data));

        })
        .catch(err => io.emit('broadcast', 'Get applications error.'));
}
