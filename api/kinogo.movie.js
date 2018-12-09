function textNodesUnder(el, window) {
    var n, a = [], walk = window.document.createTreeWalker(el, window.NodeFilter.SHOW_TEXT, null, false);
    while (n = walk.nextNode()) a.push(n);
    return a;
}
function _objectWithoutProperties(obj, keys) { 
    var target = {}; 
    for (var i in obj) { 
        if (keys.indexOf(i) >= 0) continue; 
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; 
        target[i] = obj[i]; 
    } 
    return target; 
}
const TRANS = {
    'Год выпуска': 'Year',
    'Страна': 'Country',
    'Жанр': 'Genre',
    'Качество': 'Quality',
    'Перевод': 'Translate',
    'Продолжительность': 'Duration'
}
function storyParser(story, window) {
    let descr = story.querySelector('div.shortimg>div:not(.lenta)');
    let texts = textNodesUnder(descr, window);
    let textDescription = texts.splice(0, 1)[0];
    let rawDetails = texts.map(i => i.textContent.trim()).join('|')
        .replace(/\|\|/gi, '')
        .replace(/\|,\|/gi, ',')
        .replace(/\|,/gi, ',')
        .replace(/:\|/gi, ':');
    let _details = rawDetails.split('|').map(t => t.replace(':', '|')).map(t => ({ 
            r: t.split('|')[0].trim(), 
            v: t.split('|')[1].split(',').map(t => t.trim())
        })).reduce((res, i) => {
            if (TRANS[i.r]) {
                res[TRANS[i.r]] = i.v;
            }
            return res;
        }, {})
    return {
        title: story.querySelector('div.shortstorytitle>h2').textContent,
        href: story.querySelector('div.shortstorytitle>h2>a').href,
        rating: Number(story.querySelector('div.shortstorytitle div.rating li[itemprop="average"]').textContent),
        imgSrc: descr.querySelector('a').href,
        description: textDescription.textContent,
        details: _objectWithoutProperties(_details, ['Year','Quality']),
        year: Number(_details.Year),
        quality: _details.Quality[0].toLowerCase()
    }
}
async function listParser(window) {
    let list = window.document.querySelectorAll('div.shortstory');
    return Array.from(list).map(story => storyParser(story, window));
}
listParser
//detail parser//
function findActors(window) {
    let details = Array.from(window.document.querySelectorAll('b'));
    let actNode = details.find(d => d.textContent === 'В ролях:');
    if (actNode) {
        let str = actNode.nextSibling;
        if (str && str.textContent) {
            return str.textContent.split(',').map(s => s.trim());
        }
        return [];
    }
    return [];
}
async function detailParser(window, doc) {
    doc.details['Actors'] = findActors(window);
    let script = Array.from(window.document.querySelectorAll('script'))
        .find(n => n.textContent.indexOf('flashInstalled')>0 ||
                    n.textContent.indexOf('Base64.decode')>0);
    if (script) {
        let text = script.textContent;
        const b64string = text.replace('document.write(Base64.decode(', '').replace('));', '');
        const b = Buffer.from(b64string, 'base64');
        const rawURLs = iconv.decode(b, 'win1251');
        const furls = getUrls(rawURLs);
        const urls = doc['movies'] = [];
        furls.forEach(f => {
            if (f.indexOf('.mp4') > 0 || f.indexOf('.flv') > 0) {
                if (f.indexOf('&amp') > 0) {
                    const aLinks = f.split('&amp');
                    urls.push(aLinks[1].replace(';file=',''));
                } else
                    urls.push(f);
            }
        })
    }
}
detailParser

const TRANS = {
    'Год': 'Year',
    'Страна': 'Country',
    'Жанр': 'Genre',
    'Длительность': 'Duration',
    'В ролях': 'Actors'
}
function storyParser(story, window) {
    let descr = story.querySelector('div.shortboxh');
    let textDescription = descr.querySelector('.shorttext').textContent.trim();
    let rawDetails = Array.from(descr.querySelectorAll('div.godshort'));
    rawDetails.push(descr.querySelector('div.janrshort'));
    let _details = rawDetails
        .map(n => n.textContent.trim())
        .reduce((res, i) => {
			let kv = i.split(':').map(k => k.trim());
             if (TRANS[kv[0]]) {
                 res[TRANS[kv[0]]] = kv[1];
             }
             return res;
         }, {});
    let _year = Number(_details.Year || '0');
    return {
        title: story.querySelector('div.postertitle h2>a').textContent + ` (${_year})`,
        href: story.querySelector('div.postershort a').href,
        rating: (Number(story.querySelector('div.postertitle li.current-rating').textContent)/10) * 5,
        imgSrc: story.querySelector('div.postershort a>img').src,
        description: textDescription,
        details: {
            Country: _details.Country.split(',').map(c => {
                    let res = c.trim();
                    return res[0].toUpperCase() + res.substring(1);
                }),
            Duration: [_details.Duration],
            Genre: _details.Genre.split(',').map(c => {
                    let res = c.trim();
                    return res[0].toUpperCase() + res.substring(1);
                }),
            Actors: _details.Actors.split(',').map(s => s.trim())
        },
        year: Number(_details.Year || '0'),
        quality: story.querySelector('img.po').src
                .split('/').pop().replace('.png','').toLowerCase()
    }
}
async function listParser(window) {
    let list = window.document.querySelectorAll('#dle-content div.shorposterbox');
    return Array.from(list).map(story => storyParser(story, window));
}
listParser
//detail parser//
async function detailsParser(window, doc) {
    let num = cache['cnt'] || 0;
    num++;
    cache['cnt'] = num;
    doc['cnt'] = num;
}
detailsParser
