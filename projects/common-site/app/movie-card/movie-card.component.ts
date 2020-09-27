import { Component, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy, EventEmitter, Output } from '@angular/core';

import { BehaviorSubject, Observable, combineLatest, of, fromEvent, Subject } from 'rxjs';
import { map, startWith, catchError, switchMap, filter, shareReplay, share, debounceTime, takeUntil } from 'rxjs/operators';

import { AppService } from '../app.service';

interface MovieSourceInterface {
    [key: string]: string
}

interface MovieStreamItem {
    title: string;
    source: string;
}

function getFileExt(path: string) {
    let fileExt: string;
    if (typeof path === 'string') {
        const fPart = path.split('?');
        if (fPart.length) {
            fileExt = fPart.shift();
        }
        fileExt = fileExt.split('.').pop();
        if (fileExt.length > 4) {
            fileExt = fileExt.substring(0, 4);
        }
    } else {
        fileExt = 'stream';
    }

    return fileExt;
}

function mapToStreamItem(item: any): MovieStreamItem {
    let source = item;
    if (source.link && typeof source.link !== 'function') {
        source = source.link;
    }
    if (typeof source === 'string') {
        return {
            title: getFileExt(source),
            source
        }
    }

    return source
}

const TestURL =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'nc-movie-card',
    templateUrl: './movie-card.component.html',
    styleUrls: ['./movie-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent implements OnChanges, OnDestroy {

    @Input() title: string;
    @Input() rating: string;
    @Input() href: string;
    @Input() image: string;
    @Input() genreList: Array<string>;
    @Input() quality: string;
    @Input() year: string;
    @Input() description: string;
    @Input() movieID: string;
    @Input() duration: string;
    @Input() actors: Array<string>;
    @Input() countries: Array<string>;
    @Input() sources: MovieSourceInterface[];
    @Output() updateSource = new EventEmitter<string>();

    public imgSrc = '';

    public hasLinks$ = new BehaviorSubject(false);

    public sourceList: string[];
    public currentSource: string;

    @ViewChild('sourceInput', {static: false}) sourceInput: ElementRef;

    private links$ = this.hasLinks$.pipe(
        filter(start => start),
        switchMap(() => this.service.getLinks(this.movieID)),
        share()
    );

    public directLinks$: Observable<any> = this.links$.pipe(
        map(res => res.directLinks.map(mapToStreamItem)),
        shareReplay(1)
    );

    public linksError$: Observable<string> = this.links$.pipe(
        filter(e => e instanceof Error),
        catchError(error => {
            if (error.error) {
                error = error.error;
            }
            if (error.message) {
                return of(error.message.message || error.message);
            } else {
                return of(error);
            }
        })
    )

    public streamLinks$: Observable<Array<MovieStreamItem>> = this.links$.pipe(
        map(res => res.streams.map(mapToStreamItem)),
        shareReplay(1)
    );

    public busy$: Observable<boolean> = combineLatest([
        this.hasLinks$,
        this.directLinks$.pipe(
            map(() => true),
            startWith(undefined),
            catchError(error => of(true))
        )]
    ).pipe(
        map(([sentReq, data]) => sentReq && !data),
        shareReplay(1)
    )

    private closed$ = new Subject();

    constructor(
        private service: AppService
    ) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.image) {
            this.imgSrc = `api/acc/image/${this.image}`;
        }

        if (changes.sources) {
            this.sourceList = Object
                .keys(this.sources || {});

            this.sourceList.forEach(key => {
                if (this.href === this.sources[key]) {
                    this.currentSource = key;
                }
            })
        }
    }

    ngOnDestroy() {
        this.closed$.next();
        this.closed$.complete();
    }

    public onSearchFiles() {
        this.hasLinks$.next(true);
    }

    public getFileLink(link: string): string {
        return link;
    }

    public onStreamSelect(index: number) {
        window.open(`./player/${this.movieID}/streams/${index}`);
    }

    public onDirectSelect(index: number) {
        window.open(`./player/${this.movieID}/directLinks/${index}`);
    }

    onSourceChange(sourceKey: string) {
        this.service.setMovieSource(this.movieID, this.sources[sourceKey])
            .subscribe(() => {
                this.href = this.sources[sourceKey];
                this.hasLinks$.next(false);
                this.service.updateList();
            })
    }

    onWatch() {
        window.open(`./player/${this.movieID}/watch`);
    }

    upperCase(quality: string): string {
        return (quality || '').toUpperCase();
    }

    onHrefChange(source: string): void {
        if (TestURL.test(source)) {
            this.updateSource.emit(source);
        }
    }

    // TODO: remove
    onOpenedChange(opened: boolean) {
        if (opened) {
            fromEvent(this.sourceInput.nativeElement, 'change').pipe(
                takeUntil(this.closed$),
                debounceTime(1000)
            ).subscribe((keyboardEvent: KeyboardEvent) => {
              this.onHrefChange((keyboardEvent.target as any).value);
            });    
        } else {
            this.closed$.next();
        }
    }

}
