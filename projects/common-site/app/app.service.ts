import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, empty, combineLatest, Observable } from 'rxjs';
import { map, switchMap, shareReplay, tap, debounceTime } from 'rxjs/operators';

export interface SourceDescription {
    title: string;
    source: string;
}

export interface StreamPathResult {
    link: string | SourceDescription;
    token?: any;
}

interface MoviePathResult {
    directLinks?: Array<string | SourceDescription>;
    streams?: Array<StreamPathResult>;
}

export interface MovieData extends MoviePathResult {
    id: string;
    title: string;
    url: string;
}

function getLastMonthDate(): string {
    const currentDate = new Date();
    return JSON.stringify(new Date(currentDate.setMonth(currentDate.getMonth() - 1))).replace('"', '').replace('"', '');
}

@Injectable({ providedIn: 'root' })
export class AppService {

    public reqParameters$ = new BehaviorSubject<any>(undefined);
    private req$ = this.reqParameters$.asObservable().pipe(
        map((param) => (param || {
            "rating_gt": 4,
            "lastUpdate_gt": getLastMonthDate()
        }))
    );

    public pageParameters$ = new BehaviorSubject<number>(1);
    private page$ = this.pageParameters$.asObservable().pipe(
        map(page => ({
            from: (page - 1) * 20,
            till: 20
        })),
        debounceTime(50)
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
            return res.docs;
        }),
        map((res: any[]) => res.map((e: { details: any, imgSrc: string }) => {
            const { details, imgSrc, ...props } = e;
            return {
                ...props,
                genre: details.Genre,
                img: imgSrc && imgSrc.split('/').pop(),
                actors: details.Actors || [],
                countries: details.Country || [],
                duration: (details.Duration || [])[0] || ''
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
            return this._linksCache[movieID] = this.client.get(`api/acc/moviePath/${movieID}`);
        }
    }

    public getMovie(movieID: string): Observable<any> {
        return this.client.get(`api/acc/movie/${movieID}`)
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
