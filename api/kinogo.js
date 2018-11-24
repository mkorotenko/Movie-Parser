'use strict';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function textNodesUnder(el, window) {
    var n, a = [], walk = window.document.createTreeWalker(el, window.NodeFilter.SHOW_TEXT, null, false);
    while (n = walk.nextNode()) a.push(n);
    return a;
}
const TRANS = {
    "Год выпуска": "Year",
    "Страна": "Country",
    "Жанр": "Genre",
    "Качество": "Quality",
    "Перевод": "Translate",
    "Продолжительность": "Duration"
}
function storyParser(story, window) {
    let descr = story.querySelector('div.shortimg>div:not(.lenta)');
    let texts = textNodesUnder(descr, window);
    let textDescription = texts.splice(0, 1)[0];
    let details = texts.map(i => i.textContent.trim()).join('|')
        .replace(/\|\|/gi, '')
        .replace(/\|,\|/gi, ',')
        .replace(/\|,/gi, ',')
        .replace(/:\|/gi, ':');
    return {
        title: story.querySelector('div.shortstorytitle>h2').textContent,
        href: story.querySelector('div.shortstorytitle>h2>a').href,
        rating: Number(story.querySelector('div.shortstorytitle div.rating li[itemprop="average"]').textContent),
        imgSrc: descr.querySelector('a').href,
        description: textDescription.textContent,
        details: details.split('|').map(t => t.replace(':', '|')).map(t => ({ 
            r: t.split('|')[0].trim(), 
            v: t.split('|')[1].split(',').map(t => t.trim())
        })).reduce((res, i) => {
            if (TRANS[i.r]) {
                res[TRANS[i.r]] = i.v;
            }
            return res;
        }, {})
    }
}
function listParser(window) {
    let list = window.document.querySelectorAll('div.shortstory');
    return Array.from(list).map(story => storyParser(story, window));
}

module.exports = function (html) {

    const dom = new JSDOM(html);

    return listParser(dom.window);

}