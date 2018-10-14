'use strict';
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
        content: function (req, res) {
            const httpClient = require('http');
            const parser = require('parse5');
            const iconv = require('iconv-lite');
            const copyNodes = ['div', 'span', 'a', 'b', 'ul', 'li', 'h2'];
            const lineNodes = ['span', 'a', 'b','li'];
            const textNodes = ['#text', 'img'];

            const findAttr = function (node, val) {
                if (node.attrs && node.attrs.some(a => a.value === val)) {
                  return node;
                }
              };
              
            const fullCopy = function(node) {
                const result = [];
                node.childNodes && node.childNodes.forEach(element => {
                    result.push({
                            attrs: element.attrs,
                            childNodes: fullCopy(element),
                            nodeName: element.nodeName,
                            tagName: element.tagName,
                            data: element.data,
                            value: element.value
                        });
                });
                
                return result;
            }
            
            const pluckNodes = function(node, copyText) {
                const result = [];
                node.childNodes && node.childNodes.forEach(element => {
                    if ((copyNodes.indexOf(element.nodeName) > -1)){
                        if (findAttr(element, 'shortimg')){
                            result.push({
                                attrs: element.attrs,
                                childNodes: fullCopy(element),
                                nodeName: element.nodeName,
                                tagName: element.tagName
                            });
                        } else {
                            const textNode = lineNodes.indexOf(element.nodeName) > -1;
                            result.push({
                                attrs: element.attrs,
                                childNodes: pluckNodes(element, textNode),
                                nodeName: element.nodeName,
                                tagName: element.tagName
                            });
                        }
                    } else if (copyText && (textNodes.indexOf(element.nodeName) > -1)) {
                        result.push({
                            attrs: element.attrs,
                            nodeName: element.nodeName,
                            tagName: element.tagName,
                            value: element.value
                        })
                    }
                });
                
                return result;
            }

            const searchNodes = function(node, res) {
                let finished = false;
                let nodeFoud = false;
                if (node.attrs && node.attrs.length) {
                    nodeFoud = node.attrs.some(a => a.name === 'id' && a.value === 'dle-content');
                }
                if (!nodeFoud) {
                    if (node.childNodes && node.childNodes.length)
                        finished = node.childNodes.some(n => searchNodes(n, res))
                }
                else {
                    res.push(pluckNodes(node));
                    finished = true;
                }
                return finished;
            }

            function collectNodes(node, attr, res) {
                if (node.attrs && node.attrs.some(a => a.value === attr)) {
                    res.push(node);
                    return;
                } 
                if (node.childNodes)
                    node.childNodes.forEach(n => collectNodes(n, attr, res));
            }
            
            let params = '';
            if (req.query && req.query.page) {
                params = 'page/' + req.query.page + '/';
            }

            httpClient.get('http://kinogo.cc/' + params, (resp) => {
                var chunks = [];

                resp.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                resp.on('end', () => {
                    var d = iconv.decode(Buffer.concat(chunks), 'win1251');
                    var document = parser.parse(d);
                    var nodes = [];
                    searchNodes(document, nodes);
                    var collection = [];
                    collectNodes({ childNodes: nodes[0] }, 'shortstory', collection);
                    res.json(collection);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });

        }
    };

    addRoutesMethods({ get }, 'acc');
};