const express = require('express'),
    app = express(),
    routes = require('./routes'),
    server = require('http').createServer(app); 
    io = require('socket.io')(server),
    manager = require('./app-manager');

const port = process.env.PORT || 3000;

routes(app); //register the route

server.listen(port, () => console.log(`http is started ${port}`));

// Catch errors
app.on('error', (error) => {
    console.error(new Date(), 'ERROR', error);
    let _error;
    try {
        _error = JSON.stringify(code);
    } catch(e) {
        _error = '<stringify error>'
    }
    io.emit('broadcast','Express error:' + _error);
});

manager(io);

io.on('connection', function(client) {  
    console.log('Socket: client connected');
    client.on('message', function(data) {
       console.log('message:', data); 
    });
});

