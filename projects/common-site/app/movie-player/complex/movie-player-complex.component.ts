import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject, of, combineLatest, throwError } from 'rxjs';
import { switchMap, shareReplay, map, tap, debounceTime, distinctUntilChanged, filter, catchError, takeUntil } from 'rxjs/operators';

import { AppService, StreamPathResult, SourceDescription } from '../../app.service';
import { routerAnimation } from '../models/animations';

type PlayerTypes = 'native-player' | 'hls-player' | 'flv-player';

type SourceTypes = 'FLV' | 'MP4';

interface PlayerSettings {
    player: PlayerTypes;
    src: string;
    type?: SourceTypes;
}

interface MovieData {
    id: string;
    title: string;
    url: string;
    directLinks: Array<string | SourceDescription>;
    streams: Array<string | StreamPathResult>;
}

const getLinkSource = (link: string | SourceDescription): string => {
    let source: string;
    if (typeof link === 'object') {
        source = link.source;
    } else {
        source = link;
    }
    return source;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'nc-movie-player-complex',
    templateUrl: './movie-player-complex.component.html',
    styleUrls: ['./movie-player-complex.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routerAnimation()]
})
export class MoviePlayerComplexComponent implements OnInit, OnDestroy {

    @ViewChild('player', { static: true, read: ElementRef }) playerNode: ElementRef;

    poster: string;

    movieId$: Observable<string> = this.aRoute.params.pipe(
        map(params => params.id),
        distinctUntilChanged(),
        shareReplay(1)
    );

    movieNum$: Observable<number> = this.aRoute.queryParams.pipe(
        map(query => Number(query.num || '0')),
        shareReplay(1)
    );

    movie$: Observable<MovieData> = this.movieId$.pipe(
        switchMap(id => this.service.getMovie(id)),
        switchMap((movie: MovieData) => {
            const directLinks = movie.directLinks;
            const streams = movie.streams;
            if (!directLinks.length && !streams.length) {
                return this.service.getLinks(movie.id).pipe(
                    map(links => {
                        movie.directLinks = links.directLinks;
                        movie.streams = links.streams;
                        return movie;
                    })
                )
            }
            return of(movie);
        }),
        tap(d => console.info('app movie:', d)),
        shareReplay(1)
    );

    streamList$ = this.movie$.pipe(
        map(movie => {
            if (!movie.streams || movie.streams.length < 2) {
                return null;
            }
            return movie.streams.map((stream, index) => {
                if (typeof stream.link === 'string') {
                    const parts = stream.link.split('.');
                    const fileExt = parts.pop();
                    if (fileExt) {
                        return {
                            title: fileExt.toUpperCase()
                        }
                    }
                    return {
                        title: `Stream ${index}`
                    }
                } else {
                    return stream.link
                }
            })
        })
    );

    directList$ = this.movie$.pipe(
        map(movie => {
            if (!movie.directLinks || movie.directLinks.length < 2) {
                return null;
            }
            return movie.directLinks.map((direct, index) => {
                if (typeof direct === 'string') {
                    const parts = direct.split('.');
                    const fileExt = parts.pop();
                    if (fileExt) {
                        return {
                            title: fileExt.toUpperCase()
                        }
                    } 
                    return {
                        title: `Link ${index}`
                    }
                } else {
                    return direct;
                }
            })
        })
    );

    title$ = this.movie$.pipe(
        map(movie => movie.title)
    );

    playerSettings$: Observable<PlayerSettings> = combineLatest(
        this.movie$,
        this.movieNum$
    ).pipe(
        map(([movie, num]) => {
            const id = this.paramID;
            let player: PlayerTypes, src: string, type: SourceTypes;
            const directLinks = movie.directLinks.filter(f => f);
            const streams = movie.streams.filter(f => f);

            if (directLinks.length) {
                if (!this.queryNum) {
                    const mp4Index = directLinks.findIndex(link => getLinkSource(link).toLowerCase().includes('.mp4'));
                    const flvIndex = directLinks.findIndex(link => getLinkSource(link).toLowerCase().includes('.flv'));
                    const m3uIndex = directLinks.findIndex(link => getLinkSource(link).toLowerCase().includes('.m3u8'));
                    if (flvIndex > -1) {
                        player = 'flv-player';
                        src = `/api/acc/direct/directLinks/${id}/${flvIndex}`;
                        type = 'FLV';
                        if (`${flvIndex}` !== this.queryNum) {
                            this.onPlaySelect(flvIndex);
                            return null;
                        }
                    } else if (mp4Index > -1) {
                        player = 'flv-player';
                        src = `/api/acc/direct/directLinks/${id}/${mp4Index}`;
                        type = 'MP4';
                        if (`${mp4Index}` !== this.queryNum) {
                            this.onPlaySelect(mp4Index);
                            return null;
                        }
                    } else if (m3uIndex > -1) {
                        player = 'hls-player';
                        src = `/api/acc/streamSource/streams/${id}?movie=${num}`;
                        if (`${m3uIndex}` !== this.queryNum) {
                            this.onPlaySelect(m3uIndex);
                            return null;
                        }
                    } 
                } else {
                    const link = getLinkSource(directLinks[num]);
                    const isMP4 = link.toLowerCase().includes('.mp4');
                    const isStream = link.toLowerCase().includes('.m3u8');
                    if (isMP4) {
                        player = 'flv-player';
                        src = `/api/acc/direct/directLinks/${id}/${num}`;
                        type = 'MP4';
                    } else if (isStream) {
                        player = 'hls-player';
                        src = `/api/acc/streamSource/streams/${id}?movie=${num}`;
                    } else {
                        player = 'flv-player';
                        src = `/api/acc/direct/directLinks/${id}/${num}`;
                        type = 'FLV';
                    }
                }
            } else if (streams.length) {
                player = 'hls-player';
                src = `/api/acc/streamSource/streams/${id}?movie=${num}`;
            } else {
                this.errorMessage$.next('No source');
            }
            return {
                player,
                src,
                type
            }
        }),
        filter(f => !!f)
    )

    errorMessage$ = new Subject();

    updateLinks$ = new Subject();

    unsubscribe = new Subject();

    private get paramID(): string {
        return this.aRoute.snapshot.params['id'] || '';
    }

    private get queryNum(): string {
        return this.aRoute.snapshot.queryParams['num'] || '';
    }

    constructor(
        private aRoute: ActivatedRoute,
        private router: Router,
        private service: AppService
    ) { }

    ngOnInit() {
        const docId = this.paramID;
        this.poster = `api/acc/image/${docId}`;
        this.playerNode.nativeElement.focus();
        this.playerNode.nativeElement.addEventListener('error', function (error) {
            console.error('Video error:', arguments);
            const message = error && error.message;
            const code = error && error.error && error.error.responseCode;
            if (code) {
                switch (code) {
                    case 403:
                    case 404:
                        this.updateLinks$.next();
                        break;
                    default:
                        this.errorMessage$.next(message);
                }
            } else {
                this.errorMessage$.next(message);
            }
        }.bind(this));

        this.updateLinks$.pipe(
            debounceTime(500)
        ).subscribe(() => {
            this.service.getLinks(docId).subscribe(() => location.reload());
        })

        this.movie$.pipe(
            catchError((error: HttpErrorResponse) => {
                console.info('app error:', error);
                let message = error && error.error && error.error.message;
                if (!message) {
                    message = error.statusText;
                } else if (typeof message !== 'string') {
                    message = message.message || error.statusText;
                }
                return throwError(message);
            }),
            takeUntil(this.unsubscribe)
        ).subscribe(undefined, error => this.errorMessage$.next(error));
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    // public getRouteAnimation(outlet: RouterOutlet) {
    //     const res =
    //         outlet.activatedRouteData.num === undefined
    //             ? -1
    //             : outlet.activatedRouteData.num;
    //     return res;
    // }
    //   https://medium.com/@gogakoreli/angular-7-improved-router-transition-animation-5bc4578a2f3a

    public onPlaySelect(tabNum: number) {
        this.errorMessage$.next();
        this.router.navigate([], {
            queryParams: { num:tabNum },
            relativeTo: this.aRoute
        });
    }
}
