import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { AppService, StreamPathResult } from '../app.service';
import { map, startWith, catchError, switchMap, filter, tap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

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

  public imgSrc = '';

  public hasLinks$ = new BehaviorSubject(false);

  private links$ = this.hasLinks$.pipe(
    filter(start => start),
    switchMap(() => this.service.getLinks(this.movieID)),
    shareReplay(1)
  );

  public directLinks$: Observable<any> = this.links$.pipe(
    map(res => res.directLinks)
  );

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
    private service: AppService,
    private router: Router
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.image) {
      this.imgSrc = `api/acc/image/${this.image}`;
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
    // console.info('app stream', stream);
    // this.service.getStream(this.movieID, index).subscribe(s => {
    //   console.info('app stream result', s);
    // })
    this.router.navigate(['hls', this.movieID, index]);
  }
}
