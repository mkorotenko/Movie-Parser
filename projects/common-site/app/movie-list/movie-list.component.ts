import { Component, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';
import { switchMap, shareReplay, tap, catchError, pluck } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nc-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {

  public title = 'common-site';
  public data$ = this.route.params.pipe(
    tap(param => {
      this.service.pageParameters$.next((Number(param.id || 1)));
      try{
        this.elRef.nativeElement.scrollTo(0, 0);
      } catch(error) {
        console.error(error);
      }
    }),
    switchMap(() => this.service.rootContent$),
    shareReplay(1)
  );

  public dataLoadError$ = this.data$.pipe(
      catchError(error => of(error.error)),
      pluck('message')
  )

  constructor(
    private service: AppService,
    private route: ActivatedRoute,
    private elRef: ElementRef
  ) {}

  onUpdateSource(movie: any, href: string) {
    // if (!Object.values(movie.sources).find(item => item === href)) {
      this.service.updateSource(movie._id, href).subscribe(
        () => this.service.updateList()
      );  
    // }
  }

}
