'use strict';
const jsdom = require("jsdom");
const getUrls = require('get-urls');
const iconv = require('iconv-lite');

const { JSDOM } = jsdom;

let cache = {};

module.exports = {
    list: async function (html, listParserCode) {

        cache = {};
        
        const dom = new JSDOM(html);

        let listParser = eval(listParserCode);

        return await listParser(dom.window);

    },
    details: async function (html, doc, parserCode) {

        const dom = new JSDOM(html);

        let parser = eval(parserCode);

        await parser(dom.window, doc);

    }
}