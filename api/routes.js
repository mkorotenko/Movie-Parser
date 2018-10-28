'use strict';

const imgLoader = require('./imageLoader'),
        db = require('./db');

module.exports = function (app) {

    function addRoutesMethods(module, controllerName) {
        for (let route in module.get)
            app.route('/api/' + controllerName + '/' + route)
                .get(module.get[route]);

        for (let route in module.post)
            app.route('/api/' + controllerName + '/' + route)
                .post(module.post[route]);

        for (let route in module.put)
            app.route('/api/' + controllerName + '/' + route)
                .put(module.put[route]);

        for (let route in module.delete)
            app.route('/api/' + controllerName + '/' + route)
                .delete(module.delete[route]);
    }

    let get = {
        Login: function (req, res) {
            res.json({
                success: true,
                sessID: "yn4scf1mw3qr2nlthkv3eulh",
                returnUrl: null
            });
        },

        assets: function (req, res) {
            imgLoader(req.query.img)
                .then(() => res.json(true))
                .catch((e) => res.json(e))
        },

        movies: function (req, res) {
            db.findMovies(req)
                .then(movies => res.json(movies))
                .catch(e => res.json(e))
        },

        content: function (req, res) {
            const httpClient = require('http');
            const kinogoParser = require('./kinogo');

            let params = '';
            if (req.query && req.query.page) {
                params = 'page/' + req.query.page + '/';
            }

            httpClient.get('http://kinogo.cc/' + params, (resp) => {
                var chunks = [];

                resp.on('data', (chunk) => chunks.push(chunk));

                resp.on('end', () => {
                    const data = Buffer.concat(chunks);
                    const collection = kinogoParser(data);
                    db.insertMovies(collection);

                    res.json(collection.length);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });

        }
    };

    addRoutesMethods({ get }, 'acc');
};