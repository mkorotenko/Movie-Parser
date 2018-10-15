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

  public rootContent = this.client.get('api/acc/movies?rating_gt=3.9&details.Genre_or=Фэнтези,Боевик&till=20').pipe(
    map((res: any[]) => {
      const result = res.filter(e => e.rating >= 4);
      result.sort((a, b) => b.rating - a.rating);
      return result;
    }),
    map((res: any[]) => res.map((e: { details: any, imgSrc: string }) => {
      const { details, imgSrc, ...props} = e;
      return {
        ...props,
        genre: details.Genre && details.Genre.join(','),
        quality: details.Quality && details.Quality.join(','),
        year: details.Year && details.Year.join(','),
        img: imgSrc && imgSrc.split('/').pop()
      };
    }))
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
