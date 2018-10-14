import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, tap } from 'rxjs/operators';

const buildTree = function (node, parent?) {
  if (parent) {
    node.parent = parent;
  }
  if (node.childNodes) {
    node.childNodes.forEach(n => buildTree(n, node));
  }
};

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

const findAttrName = function (node, val, res?) {
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

const getRatings = function (node) {
  node.childNodes.forEach(n => {
    const ratingNode = findAttrAll(n, 'current-rating');
    if (ratingNode) {
      n.rating = ratingNode.childNodes[0].value;
    }
  });
};

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public rootContent = this.client.get('api/acc/content?page=2').pipe(
    //public rootContent = this.client.get('assets/data.json').pipe(
    // map((res: object[]) => res.map(element => {
    //   const result = {};

    //   const ratingNode = findAttrAll(element, 'current-rating');
    //   if (ratingNode) {
    //     result['rating'] = ratingNode.childNodes[0].value;
    //   } else {
    //     console.error('rating not found', element);
    //   }

    //   const imgNodes = findAttrName(element, 'src');
    //   const withTitle = findAttrName({ childNodes: imgNodes }, 'title');
    //   if (withTitle.length) {
    //     result['title'] = getAttr(withTitle[0], 'title');
    //     result['imgSrc'] = getAttr(withTitle[0], 'src');
    //   } else {
    //     console.error('title attribute not found', element);
    //   }

    //   const hrefNode = findAttrAll(element, 'zagolovki');
    //   if (hrefNode) {
    //     result['href'] = getAttr(hrefNode, 'href');
    //   } else {
    //     console.error('zagolovki not found', element);
    //   }

    //   const details = findAttrAll(element, 'shortimg');
    //   if (details && details.childNodes) {
    //     const detailsNode = details.childNodes.find(e => e.attrs && e.attrs[0].name === 'id');
    //     if (detailsNode) {
    //       const detailList = detailsNode.childNodes.filter(e => e.nodeName !== 'br' && e.nodeName !== '#comment');
    //       result['description'] = detailList[1].value;
    //       const collected = result['details'] = {};
    //       let currentList;
    //       for (let i = 2; i < detailList.length; i++) {
    //         let currNode = detailList[i];
    //         switch (currNode.nodeName) {
    //           case 'a':
    //             currNode = currNode.childNodes[0];
    //           // tslint:disable-next-line:no-switch-case-fall-through
    //           case '#text':
    //             if (currentList) {
    //               const text = (currNode.value || '').trim();
    //               if (text && text !== ',') {
    //                 currentList.push(text);
    //               }
    //             }
    //           break;
    //           case 'b': {
    //             switch (currNode.childNodes[0].value) {
    //               case 'Год выпуска:':
    //                 collected['Year'] = currentList = [];
    //                 break;
    //               case 'Страна:':
    //                 collected['Country'] = currentList = [];
    //                 break;
    //               case 'Жанр:':
    //                 collected['Genre'] = currentList = [];
    //                 break;
    //               case 'Качество:':
    //                 collected['Quality'] = currentList = [];
    //                 break;
    //               case 'Перевод:':
    //                 collected['Translate'] = currentList = [];
    //                 break;
    //               case 'Продолжительность:':
    //                 collected['Duration'] = currentList = [];
    //                 break;
    //               case 'Премьера (РФ):':
    //                 collected['Release'] = currentList = [];
    //                 break;
    //               default:
    //                 currentList = undefined;
    //                 if (currNode.childNodes[0].value) {
    //                   console.error('Corresponding section not found,', currNode.childNodes[0].value);
    //                 }
    //             }
    //           }
    //           break;
    //         }
    //       }
    //       console.info('detailList', detailList);
    //     } else {
    //       console.error('Details not found', details);
    //     }
    //   } else {
    //     console.error('Details section not found', element);
    //   }
    //   return result;
    // })),
    tap(data => console.info('data', data))
  );

  constructor(
    private client: HttpClient
  ) {
    window['getAttr'] = getAttr;
    window['findAttr'] = findAttrAll;
    window['findAttrName'] = findAttrName;
    window['getRatings'] = getRatings;
  }

}
