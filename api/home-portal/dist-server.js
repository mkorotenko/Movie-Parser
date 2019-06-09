const express = require('express'),
  app = express(),
  routes = require('./routes'),
  server = require('http').createServer(app),
  io = require('socket.io')(server),
  manager = require('./threads/app-manager');

const port = process.env.PORT || 3000;

routes(app); //register the route

server.listen(port, () => console.log(`Admin server is started ${port}`));

// Catch errors
app.on('error', (error) => {
  console.error(new Date(), 'ERROR', error);
  let _error;
  try {
    _error = JSON.stringify(code);
  } catch (e) {
    _error = '<stringify error>'
  }
  io.emit('broadcast', 'Express error:' + _error);
});

const appManager = new manager();

io.on('connection', function (client) {
  console.log('Socket: client connected');
  // client.on('message', function(data) {
  //    console.log('message:', data); 
  // });
  // client.on('getAppList', function (client) {
  //   console.log('Socket: app list request');
  //   setTimeout(() => {
  //     client.emit('appList', []);
  //   });
  // });
  appManager.on('app_message', function(message) {
    // console.info('')
    client.emit('message', message);
  })

  client.emit('message', 'Connection established');
  client.broadcast.emit('broadcast', `New client connected`);
  client.on('message', function (data) {
    console.log('message:', data);
    client.emit('message', data);
  });
});

appManager.startApplications();
