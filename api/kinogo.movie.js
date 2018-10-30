'use strict';
module.exports = function (data) {

    const parser = require('parse5');
    const iconv = require('iconv-lite');
    const getUrls = require('get-urls');

    const searchNodes = function (node, res) {

        if (node.nodeName === 'script')
            res.push(node);
        else {
            if (node.childNodes && node.childNodes.length)
                node.childNodes.forEach(n => searchNodes(n, res))
        }
    }

    function collectNodes(nodes, res) {
        nodes.some(n => {
            if (n.childNodes && n.childNodes.length) {
                const c = n.childNodes[0];
                if (c.nodeName === "#text") {
                    if (c.value.indexOf('flashInstalled') > 0) {
                        res.push(c);
                        return true;
                    } else if (c.value.indexOf('Base64.decode') > 0) {
                        const b64string = c.value.replace('document.write(Base64.decode(', '').replace('));', '');
                        const b = Buffer.from(b64string, 'base64');
                        c.value = iconv.decode(b, 'win1251');
                        res.push(c);
                        return true;
                    }
                }
            }
        })
    }

    var d = iconv.decode(data, 'win1251');
    var document = parser.parse(d);
    var nodes = [];
    searchNodes(document, nodes);
    var collection = [];

    collectNodes(nodes, collection);

    const urls = [];

    collection.forEach(c => {
        const furls = getUrls(c.value);
        furls.forEach(f => {
            if (f.indexOf('.mp4') > 0 || f.indexOf('.flv') > 0) {
                if (f.indexOf('&amp') > 0) {
                    const aLinks = f.split('&amp');
                    urls.push(aLinks[1].replace(';file=',''));
                } else
                    urls.push(f);
            }
        })
    })

    return urls;

}