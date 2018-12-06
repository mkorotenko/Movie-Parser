'use strict';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = function (html, listParserCode) {

    const dom = new JSDOM(html);

    let listParser = eval(listParserCode);

    return listParser(dom.window);

}