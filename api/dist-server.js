// Allowed extensions list can be extended depending on your own needs
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];

const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    app = express(),
    port = process.env.PORT || 3000,
    routes = require('./routes'),
    imgLoader = require('./imageLoader'),
    mongo = require('./mongodb-server'),
    server = require('http').createServer(app); 
    io = require('socket.io')(server);

global.srcPath = process.env.PATH_SRC || 'src';

routes(app); //register the route

app.get('*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        if (req.url.indexOf('assets/images') > 0) {
            if (fs.existsSync(`src${req.url}`)) {
                res.sendFile(path.resolve(`src${req.url}`));
            } else {
                imgLoader(req.url)
                    .then(function() {
                        res.sendFile(path.resolve(`src${req.url}`));
                    })
                    .catch(function(e) {
                        res.json(e);
                    })
            }
        } else
            res.sendFile(path.resolve(`dist${req.url}`));
    } else {
        res.sendFile(path.resolve('dist/index.html'));
    }
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ limit: '50mb' }));
app.use(bodyParser.text({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

server.listen(port, () => console.log(`http is started ${port}`));

// Catch errors
app.on('error', (error) => {
    console.error(new Date(), 'ERROR', error);
});

if (process.env.PATH_SRC) {
    let _onExit = mongo.onExit;
    mongo.onExit = function(code) {
        console.info('Mongo stoped with code:', code);
        io.emit('broadcast','Mongo stoped with code:' + code)
        if (_onExit)
            _onExit.call(mongo, code);
        setTimeout(() => {
            console.info('Mongo restarting...');
            io.emit('broadcast','Mongo restarting...')
            mongo.run();
        }, 10000);
    }
    mongo.run();
}

io.on('connection', function(client) {  
    console.log('Socket: client connected');
    client.on('message', function(data) {
       console.log('message:', data); 
    });
    // setInterval(() => {
    //     console.log('test ping client:'); 
    //     client.emit('test ping client')
    // }, 2000)
});

