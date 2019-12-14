import { Component, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, startWith, catchError, switchMap, filter, shareReplay, share } from 'rxjs/operators';
import { AppService } from '../app.service';

interface MovieSourceInterface {
  [key:string]: string
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nc-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent implements OnChanges {

  @Input() title: string;
  @Input() rating: string;
  @Input() href: string;
  @Input() image: string;
  @Input() genre: string;
  @Input() quality: string;
  @Input() year: string;
  @Input() description: string;
  @Input() movieID: string;
  @Input() sources: MovieSourceInterface[];

  public imgSrc = '';

  public hasLinks$ = new BehaviorSubject(false);

  public sourceList: string[];
  public currentSource: string;

  private links$ = this.hasLinks$.pipe(
    filter(start => start),
    switchMap(() => this.service.getLinks(this.movieID)),
    share()
  );

  public directLinks$: Observable<any> = this.links$.pipe(
    map(res => res.directLinks)
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

  public streamLinks$: Observable<any> = this.links$.pipe(
    map(res => res.streams)
  );

  public busy$: Observable<boolean> = combineLatest(
    this.hasLinks$,
    this.directLinks$.pipe(
      map(() => true),
      startWith(undefined),
      catchError(error => of(true))
    )
  ).pipe(
    map(([sentReq, data]) => sentReq && !data),
    shareReplay(1)
  )

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

  public fileExt(path: string) {
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

  public onSearchFiles() {
    this.hasLinks$.next(true);
  }

  public getFileLink(link: string): string {
    return link;
  }

  public onStreamSelect(index: number) {
    window.open(`./hls/${this.movieID}/${index}`);
  }

  onSourceChange(sourceKey: string) {
    this.service.setMovieSource(this.movieID, this.sources[sourceKey])
      .subscribe(() => {
        this.href = this.sources[sourceKey];
        this.hasLinks$.next(false);
      })
  }

}
