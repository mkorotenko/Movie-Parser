'use strict';
const jsdom = require("jsdom");
const getUrls = require('get-urls');
const iconv = require('iconv-lite');

const { JSDOM } = jsdom;

module.exports = {
    list: function (html, listParserCode) {

        const dom = new JSDOM(html);

        let listParser = eval(listParserCode);

        let result;

        result = listParser(dom.window);

        return result;

    },
    details: function (html, doc, parserCode) {

        const dom = new JSDOM(html);

        let parser = eval(parserCode);

        parser(dom.window, doc);

    }
}