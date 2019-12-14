import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, empty, combineLatest, Observable } from 'rxjs';
import { map, switchMap, shareReplay, tap } from 'rxjs/operators';

export interface StreamPathResult{
  link: string;
  token?: any;
}

interface MoviePathResult{
  directLinks?: String[];
  streams?: StreamPathResult[];
}

@Injectable({ providedIn: 'root' })
export class AppService {

  public reqParameters$ = new BehaviorSubject<any>(undefined);
  private req$ = this.reqParameters$.asObservable().pipe(
    map((param) => (param || {
      rating_gt: 4.8,
      'details.Genre_or': ['Фэнтези', 'Боевик']
    }))
  );

  public pageParameters$ = new BehaviorSubject<number>(1);
  private page$ = this.pageParameters$.asObservable().pipe(
    map(page => ({
      from: (page - 1) * 20,
      till: 20
    }))
  );

  private movies$ = combineLatest(this.req$, this.page$).pipe(
    map(([req, page]) => {
      return {
        ...req,
        ...page
      };
    }),
    switchMap((parameters: any) => {
      if (parameters === undefined) {
        return empty();
      } else {
        return this.client.get('api/acc/movies', { params: parameters || { till: 20 } });
      }
    }),
    shareReplay(1)
  );

  public movieCount$ = this.movies$.pipe(
    map((res: any) => res.count)
  );

  public rootContent$ = this.movies$.pipe(
    map((res: { docs: any[] }) => {
      const result = res.docs;
      result.sort((a, b) => b.rating - a.rating);
      return result;
    }),
    map((res: any[]) => res.map((e: { details: any, imgSrc: string }) => {
      const { details, imgSrc, ...props} = e;
      return {
        ...props,
        genre: details.Genre && details.Genre.join(','),
        img: imgSrc && imgSrc.split('/').pop()
      };
    })),
    shareReplay(1)
  );

  constructor(
    private client: HttpClient
  ) { }

  private _linksCache = {};
  public getLinks(movieID: string): Observable<MoviePathResult> {
    if (this._linksCache[movieID]) {
      return this._linksCache[movieID];
    } else {
      return this._linksCache[movieID] = this.client.get(`api/acc/moviePath/${movieID}`).pipe(
        // shareReplay(1)
      );
    }
  }

  public getStream(movieID: string, index: number): Observable<any> {
    return this.client.get(`api/acc/proxy/${movieID}?movie=${index}`, {
      responseType: 'text'
    }).pipe(
      map(l => l.split('\n')[2])
    );
  }

  public setMovieSource(movieID: string, href: string) {
    return this.client.patch(`api/acc/source/${movieID}`, {
      href
    }).pipe(
      tap(() => {
        this._linksCache[movieID] = undefined;
      })
    )
  }

}
