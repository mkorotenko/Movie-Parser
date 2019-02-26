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
    return Array.from(list)
        .map(story => storyParser(story, window));
}
listParser
//detail parser//

const httpClient = require('http'),
    CryptoJS = require("crypto-js"),
    zlib = require('zlib'),
    request = require("request");
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36';
const e = {};

async function getContent(url, headers, unzip) {
    return new Promise((resolve, reject) => {
        httpClient.get(url, { headers: headers }, (resp) => {
            var chunks = [];
            let _resp = resp;

            resp.on('data', (chunk) => chunks.push(chunk));

            resp.on('end', () => {
                const data = Buffer.concat(chunks);
                const html = iconv.decode(data, 'utf8');
                if (unzip) {
                    zlib.gunzip(data, function(err, dezipped) {
                        resolve({
                            headers: _resp.headers,
                            html: dezipped.toString(),
                            statusCode: _resp.statusCode
                        });
                    });
                } else {
                    resolve({
                        headers: _resp.headers,
                        html: html,
                        statusCode: _resp.statusCode
                    });
                }
            });

        })
        .on("error", (error) => {
            throw error;
        });
    });
}

async function getTokenGenerator(html) {

    const s = `<script src="/assets/`;
    const scr = html.split(s);
    const scrURL = scr[1].split(`"></script>`)[0];

    const headers = {
        Host: 'mastarti.com',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,be;q=0.6,bg;q=0.5,uk;q=0.4'
    };

    const scrContent = await getContent('http://mastarti.com/assets/'+scrURL, headers, true);

    if (scrContent.statusCode !== 200) {
        const mess = {
            message: 'Get token generator error',
            data: scrContent.statusCode,
            url: 'http://mastarti.com/assets/' + scrURL,
            error: scrContent.html
        }
        throw mess;
    }
    
    let result = '';
    const parts = scrContent.html.split('function(){var n={');
    parts.forEach(p => {
        const ends = p.split(',u=t.ajax(');
        if (ends.length = 2) {
            result = ends[0];
            result = result.replace(/this.options/g, 'options');
            result = result.replace(/e._mw_adb/g, 'false');
            result = result.replace(/navigator.userAgent/g, 'USER_AGENT');
        }
    })
    return 'var n={' + result;
}

function createLocalToken(options, tokenGenerator) {
    let r = eval(`let e={}; (function gen(options) {${tokenGenerator}; return l})(options)`);
    return r;
}

async function postVS2(url, referer, data) {
    const path = url.split('/');
    return new Promise((resolve, reject) => {

        var options = { 
            method: 'POST',
            url: url,
            headers: { 
                'cache-control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': USER_AGENT,
                Referer: referer,
                Origin: path[0] + '://' + path[2],
                Accept: 'application/json, text/javascript, */*; q=0.01' 
            },
            form: data
        };

        request(options, function (error, response, body) {
            // if (error) throw new Error(error);

            resolve({
                headers: response.headers,
                body: body,
                statusCode: response.statusCode
            });
        });

    });
}

async function detailsParser(window, doc) {

    const videoNodes = Array.from(window.document.querySelectorAll('.boxfilm script'))
        .filter(s => s.textContent.indexOf('filmSource') >= 0);

    const movies = doc['movies'] = [];
    videoNodes.forEach(s => {
        const regRes = /filmSource = \"(.*?)\"/.exec(s.textContent);
        if (regRes && regRes.length)
            movies.push(regRes[1]);
    });

    const iframe = Array.from(window.document.querySelectorAll('iframe'))
        .find(i => i.src.indexOf('moonwalk.cc') > 0);

    if (iframe) {
        const url = iframe.src;
        const headers = {
            Host: 'moonwalk.cc',
            Connection: 'keep-alive',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            Referer: doc.href,
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'uk-UA,uk;q=0.9,ru;q=0.8,en-US;q=0.7,en;q=0.6'
        };

        const refReq = await getContent(url, headers);

        if (refReq.statusCode === 302) {

            const iframeRef = refReq.headers.location;
            const contIframe = await getContent(iframeRef, {});

            const iframeDOM = new JSDOM(contIframe.html);
            const document = iframeDOM.window.document;

            const scripts = Array.from(document.querySelectorAll('script'));
            const rawSettings = scripts.find(s => {
                return s.textContent.indexOf('new VideoBalancer') >= 0;
            });

            if (rawSettings) {
                const rawJson = rawSettings.textContent
                    .replace('window.video_balancer = new VideoBalancer', 'return ')
                    .trim();

                let window = {};
                let $ = function(f) {
                    return f();
                }
                let settings;
                try {
                    settings = eval(rawJson);
                } catch (error) {
                    const mess = {
                        message: 'Invalid JSON',
                        data: rawSettings.textContent,
                        url: refReq.headers.location
                    }
                    throw mess;
                }

                const tokenGenerator = await getTokenGenerator(contIframe.html);
                const locToken = createLocalToken(settings, tokenGenerator);

                const data = {
                    q: locToken.toString(),
                    ref: settings.ref,
                };

                let resVS;
                try {
                    resVS = await postVS2(
                        'http://mastarti.com/vs', 
                        iframeRef, 
                        data
                    );
                } catch (error) {
                    const mess = {
                        message: 'Request error',
                        data: rawSettings.textContent,
                        url: refReq.headers.location,
                        error: error.message
                    }
                    throw mess;
                }

                if (resVS && resVS.statusCode !== 403) {
                    let movieList;
                    try {
                        let list = JSON.parse(resVS.body);
                        movieList = Object.keys(list)
                            .map(k => list[k]);
                    } catch(error) {
                        const mess = {
                            message: 'Invalid JSON m3u8',
                            data: resVS.body,
                            url: refReq.headers.location
                        }
                        throw mess;
                    }

                    doc['movieList'] = movieList;
                } else {
                    data['message'] = 'Invalid q';
                    data['settings'] = settings;
                    data['url'] = iframe.src;
                    throw data;
                }

            } else {
                contIframe['message'] === 'Settings not found';
                throw contIframe;
            }

        } else {
            refReq['message'] === 'Uknown status code';
            throw refReq;
        }
       
    } else {

    }
}

detailsParser

