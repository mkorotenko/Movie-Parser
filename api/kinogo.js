'use strict';
module.exports = function (data) {

    const parser = require('parse5');
    const iconv = require('iconv-lite');
    const copyNodes = ['div', 'span', 'a', 'b', 'ul', 'li', 'h2'];
    const lineNodes = ['span', 'a', 'b', 'li'];
    const textNodes = ['#text', 'img'];

    const findAttr = function (node, val) {
        if (node.attrs && node.attrs.some(a => a.value === val)) {
            return node;
        }
    };

    const fullCopy = function (node) {
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

    const pluckNodes = function (node, copyText) {
        const result = [];
        node.childNodes && node.childNodes.forEach(element => {
            if ((copyNodes.indexOf(element.nodeName) > -1)) {
                if (findAttr(element, 'shortimg')) {
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

    const searchNodes = function (node, res) {
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

    const findAttrAll = function (node, val) {
        if (node.attrs && node.attrs.some(a => a.value === val)) {
            return node;
        } else
            if (node.childNodes) {
                let res;
                node.childNodes.some(n => {
                    res = findAttrAll(n, val);
                    return !!res;
                });
                return res;
            }
    };

    const findAttrName = function (node, val, res) {
        const _res = res || [];
        if (node.attrs && node.attrs.some(a => a.name === val)) {
            _res.push(node);
        }

        if (node.childNodes) {
            node.childNodes.forEach(n => findAttrName(n, val, _res));
        }

        return _res;
    };

    const getAttr = function (node, val) {
        let res;
        if (node.attrs && node.attrs.some(a => {
            if (a.name === val) {
                res = a.value;
                return true;
            }
        })) {
            return res;
        } else
            if (node.childNodes) {
                node.childNodes.some(n => {
                    res = getAttr(n, val);
                    return !!res;
                });
                return res;
            }
    };

    function collectNodes(node, attr, res) {
        if (node.attrs && node.attrs.some(a => a.value === attr)) {
            res.push(node);
            return;
        }
        if (node.childNodes)
            node.childNodes.forEach(n => collectNodes(n, attr, res));
    }

    var d = iconv.decode(data, 'win1251');
    var document = parser.parse(d);
    var nodes = [];
    searchNodes(document, nodes);
    var collection = [];

    collectNodes({ childNodes: nodes[0] }, 'shortstory', collection);

    return collection.map(element => {
        const result = {};

        const ratingNode = findAttrAll(element, 'current-rating');
        if (ratingNode) {
            result['rating'] = ratingNode.childNodes[0].value;
        } else {
            console.error('rating not found', element);
        }

        const imgNodes = findAttrName(element, 'src');
        const withTitle = findAttrName({ childNodes: imgNodes }, 'title');
        if (withTitle.length) {
            result['title'] = getAttr(withTitle[0], 'title');
            result['imgSrc'] = getAttr(withTitle[0], 'src');
        } else {
            console.error('title attribute not found', element);
        }

        const hrefNode = findAttrAll(element, 'zagolovki');
        if (hrefNode) {
            result['href'] = getAttr(hrefNode, 'href');
        } else {
            console.error('zagolovki not found', element);
        }

        const details = findAttrAll(element, 'shortimg');
        if (details && details.childNodes) {
            const detailsNode = details.childNodes.find(e => e.attrs && e.attrs[0].name === 'id');
            if (detailsNode) {
                const detailList = detailsNode.childNodes.filter(e => e.nodeName !== 'br' && e.nodeName !== '#comment');
                result['description'] = detailList[1].value;
                const collected = result['details'] = {};
                let currentList;
                for (let i = 2; i < detailList.length; i++) {
                    let currNode = detailList[i];
                    switch (currNode.nodeName) {
                        case 'a':
                            currNode = currNode.childNodes[0];
                        // tslint:disable-next-line:no-switch-case-fall-through
                        case '#text':
                            if (currentList) {
                                const text = (currNode.value || '').trim();
                                if (text && text !== ',') {
                                    currentList.push(text);
                                }
                            }
                            break;
                        case 'b': {
                            switch (currNode.childNodes[0].value) {
                                case 'Год выпуска:':
                                    collected['Year'] = currentList = [];
                                    break;
                                case 'Страна:':
                                    collected['Country'] = currentList = [];
                                    break;
                                case 'Жанр:':
                                    collected['Genre'] = currentList = [];
                                    break;
                                case 'Качество:':
                                    collected['Quality'] = currentList = [];
                                    break;
                                case 'Перевод:':
                                    collected['Translate'] = currentList = [];
                                    break;
                                case 'Продолжительность:':
                                    collected['Duration'] = currentList = [];
                                    break;
                                case 'Премьера (РФ):':
                                    collected['Release'] = currentList = [];
                                    break;
                                default:
                                    currentList = undefined;
                                    if (currNode.childNodes[0].value) {
                                        console.error('Corresponding section not found,', currNode.childNodes[0].value);
                                    }
                            }
                        }
                            break;
                    }
                }
            } else {
                console.error('Details not found', details);
            }
        } else {
            console.error('Details section not found', element);
        }
        return result;
    })

}