const express = require('express'),
    app = express(),
    routes = require('./routes'),
    server = require('http').createServer(app); 

const port = 80;

routes(app);

server.listen(port, () => console.log(`Movie store is started ${port}`));

// Catch errors
app.on('error', (error) => {
    console.error(new Date(), 'ERROR', error);
    let _error;
    try {
        _error = JSON.stringify(code);
    } catch(e) {
        _error = '<stringify error>'
    }
});
