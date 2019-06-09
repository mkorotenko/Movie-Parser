const mongo = require('./mongodb-server'),
  thread = require('./application-thread'),
  db = require('../db'),
  EventEmitter = require('events'),
  childProcess = require('./child-manager');

module.exports = class AppManager extends EventEmitter {

  constructor() {
    super();
    if (process.env.MONGO_DB !== 'false') {
      let _onExit = mongo.onExit;
      mongo.onExit = function (code) {
        console.info('Mongo stoped with code:', code);
        this.emit('app_message', `Mongo stoped with code: ${code}`);
        if (_onExit)
          _onExit.call(mongo, code);
  
        if (code !== 48 && code !== 100) {
          setTimeout(() => {
            console.info('Mongo restarting...');
            this.emit('app_message', `Mongo restarting...`);
            mongo.run();
          }, 10000);
        }
      }
      mongo.run();
    }
  
  }

  startApplications() {
  
    return db.getApplications()
    .then(data => {
      const appList = data.docs;

      this.emit('app_message', `Get applications success: ${data.count}`);

      appList.sort((a, b) => a.order - b.order);

      appList.forEach(appData => {
        if (!appData.disabled) {
          const appThread = new childProcess(
            appData.title,
            appData.cmd,
            appData.params
          );
    
          appThread.onMessage = function (message) {
            console.info(`${appData.title} message:`, message);
            this.emit('app_message', `${appData.title} message: ${message}`);
          }.bind(this);
  
          appThread.onExit = function (code) {
            console.info(`${appData.title} stoped with code:`, code);
            this.emit('app_message', `${appData.title} stoped with code: ${code}`);
          }.bind(this);
    
          console.info(`Starting ${appData.title}`);
          this.emit('app_message', `Starting ${appData.title}`);
          appThread.run();
        }
      })

    })
    .catch(err => {
      this.emit('app_message', `Get applications error: ${err.message}`);
    });

  }

}
