'use strict';

const db = require('./db'),
  path = require('path'),
  bodyParser = require('body-parser'),
  request = require('request');

const serializeError = require('serialize-error');
const sourceParser = require('./sourceParser');

const httpClient = require('http');
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

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';

const getCollectionName = function (req) {
  let collectionName = 'documents';
  if (req.params) {
    if (req.params[0])
      collectionName = req.params[0];
  };
  return collectionName;
}

function _getSourceData(url, coding) {
  const iconv = require('iconv-lite');
  return new Promise((resolve, reject) => {
    request({url: url, encoding:null}, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }
      const html = iconv.decode(body, coding || 'utf8');
      resolve(html);
    });
  })
}

function loadJSON(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(JSON.parse(body)));
    req.on('error', err => reject(err));
  })
}

async function parseSource(parserName, params, _data) {

  let data = _data || {};

  const docParser = await db.getParser({ url: parserName });//req.query.url });

  const html = await _getSourceData('https://' + docParser.url + '/' + params, docParser.coding);

  const rawCollection = await sourceParser.list(html, data.listParser || docParser.listParser);

  const collection = rawCollection
    .filter(i => !i.details.Country.includes("Россия"));

  await Promise.all(collection.map(async (doc) => {
    const _html = await _getSourceData(doc.href, docParser.coding);
    try {
      await sourceParser.details(_html, doc, data.parser || docParser.parser);
    } catch (error) {

    }
  }));

  return collection;

};

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

    "documents/*": function (req, res) {
      db.getDocuments(getCollectionName(req), req.query || { till: 20 })
        .then(docs => res.json(docs))
        .catch(err => res.json(err))
    },

    "parser": function (req, res) {
      db.getParser(req.query)
        .then(parser => res.json(parser))
        .catch(err => res.json(err))
    },

    "content": async function (req, res) {
      const _pStart = (req.query && (1 * (req.query.page || 0))) || 0;
      const _pEnd = ((req.query && (1 * (req.query.end || _pStart))) || _pStart) + 1;

      //const tasks = [];
      const results = [];

      try {
        for (let pageStart = _pStart; pageStart < _pEnd; pageStart++) {
          let params = '';
          if (pageStart) {
            params = 'page/' + pageStart + '/';
          }

          let parserName = req.query.url.replace('.', '_');
          let taskRes = await new Promise(async (resolve, reject) => {
            let collection;
            try {
              collection = await parseSource(req.query.url, params)
            } catch (error) {
              error['results'] = results;
              pageStart = _pEnd;
              throw error;
            };

            const tasks = collection.map(movie => db.findMovies({
              title: movie.title
            }));

            let foundMovies;
            try {
              foundMovies = await Promise.all(tasks);
            } catch (error) {
              error['results'] = results;
              pageStart = _pEnd;
              throw error;
            }

            const toInsert = foundMovies
              .filter(d => !d.count)
              .map(d => {
                const _doc = collection.find(c => c.title == d.filter.title);
                const sources = _doc.sources || {};
                sources[parserName] = _doc.href;
                _doc.sources = sources;
                return _doc;
              });

            if (toInsert && toInsert.length)
              db.insertMovies(toInsert);

            const toUpdate = foundMovies
              .filter(d => {
                let result = false;
                if (d.count) {
                  const doc = d.docs[0];
                  const newDoc = collection.find(c => c.title == doc.title);
                  newDoc['sources'] = {};
                  if (!doc.sources) {
                    doc.sources = {
                      kinogo_cc: doc.href
                    }
                  }

                  if ((newDoc['quality'] || '').toLowerCase() === 'hdrip' &&
                    (doc['quality'] || '').toLowerCase() !== 'hdrip') {
                    result = true;
                  } else {
                    const docKeys = Object.keys(doc);//_id field
                    const newDocKeys = Object.keys(newDoc);

                    if ((docKeys.length - 1) < newDocKeys.length) {
                      result = true;
                    } else {
                      const simpleFields = [
                        'description',
                        // 'href',
                        // 'imgSrc',
                        'quality',
                        'rating',
                        'year'
                      ];
                      newDocKeys.some(key => {
                        if (simpleFields.includes(key)) {
                          if (doc[key] != newDoc[key]) {
                            result = true;
                            return true;
                          }
                        } else {
                          if (key === 'details') {
                            if (newDoc.details['Actors'] && newDoc.details['Actors'].length &&
                              (!doc.details || !doc.details['Actors'] || newDoc.details['Actors'].length > doc.details['Actors'].length)) {
                              result = true;
                              return true;
                            }
                          } else if (key === 'sources') {
                            if (!doc.sources || !doc.sources[parserName] || doc.sources[parserName] !== newDoc.href)
                              result = true;
                              return true;
                          }
                        }
                      })
                    }
                  }

                }
                return result;
              })
              .map(d => {
                return Object.assign(
                  collection.find(c => c.title == d.filter.title),
                  { 
                    _id: d.docs[0]._id,
                    sources: d.docs[0].sources,
                  }
                )
              });

            let updates = toUpdate.map(doc => {
              let { _id, ..._doc } = doc;
              let sources = _doc.sources || {};
              sources[parserName] = _doc.href;
              _doc.sources = sources;
              return db.updateMovie(doc._id, _doc);
            });

            Promise.all(updates)
              .then(() => {
                resolve({ 
                  page: pageStart,
                  new: toInsert,
                  update: toUpdate,
                  count: collection.length 
                });
              })
              .catch(error => {
                error['results'] = results;
                pageStart = _pEnd;
                reject(error);
              });

          })

          results.push(taskRes);
        }
      } catch (error) {
        error['results'] = results;
        res.set('Content-Type', 'application/json; charset=utf-8')
        res.statusCode = 500;
        res.send(serializeError(error));
        //pageStart = _pEnd;
      }

      res.json(results);

    },

    "sources": function (req, res) {
      db.getDocuments('parsers', req.query || { till: 20 })
        .then(result => {
          let sources = result.docs.map(s => ({ value: s.url, description: s.description || '' }));
          res.json(sources);
        })
        .catch(err => res.json(err))
    }

  };

  let post = {

    "parser": function (req, res) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        let data = JSON.parse(body);
        db.updateParser(data)
          .then(result => res.json(result))
          .catch(err => res.json(err));
      });
    },

    "parserTest": async function (req, res) {
      let params = '';
      if (req.query && req.query.page) {
        params = 'page/' + req.query.page + '/';
      }

      const data = await loadJSON(req);

      parseSource(req.query.url, params, data)
        .then(list => res.json({ result: list }))
        .catch(error => {
          res.set('Content-Type', 'application/json; charset=utf-8')
          res.statusCode = 500;
          res.send(serializeError(error));
        });
    },

    "documents/*": function (req, res) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        let data = JSON.parse(body);
        db.insertDocuments(getCollectionName(req), data)
          .then(result => res.json(result))
          .catch(err => res.json(err));
      });
    }

  };

  let put = {

    "movies": function (req, res) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        let data = JSON.parse(body);
        db.putMovies(data)
          .then(result => res.json(result))
          .catch(e => res.json(e))
      });
    },

    "documents/*": function (req, res) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        let data = JSON.parse(body);
        db.putDocuments(getCollectionName(req), data)
          .then(result => res.json(result))
          .catch(e => res.json(e))
      });
    }

  };

  let del = {

    "movies": function (req, res) {
      db.deleteMovies(req.query)
        .then(result => res.json(result))
        .catch(e => res.json(e))
    },

    "documents/*": function (req, res) {
      db.deleteDocuments(getCollectionName(req), req.query)
        .then(result => res.json(result))
        .catch(e => res.json(e))
    }

  };

  addRoutesMethods({ get }, 'acc');
  addRoutesMethods({ post }, 'acc');
  addRoutesMethods({ put: put }, 'acc');
  addRoutesMethods({ delete: del }, 'acc');

  app.get('*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
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

};