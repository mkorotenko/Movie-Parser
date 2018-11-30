import {
  Component, ChangeDetectionStrategy, ViewChild, ElementRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  @ViewChild('yearInput') yearInput: ElementRef;

  public title = 'nice-kinogo';

  public params$ = this.aRoute.queryParams.pipe(
    map(params => params),
    shareReplay(1)
  );

  public pages$ = this.service.movieCount$.pipe(
    map((count) => {
      const pageCount = Math.round(Number(count) / 20 + .5);
      const res = new Array(pageCount);
      for (let i = 0; i < pageCount; i++) {
        res[i] = i + 1;
      }
      return res;
    })
  );

  constructor(
    private service: AppService,
    private aRoute: ActivatedRoute,
    private router: Router
  ) {
    aRoute.queryParams.subscribe(params => {
      if (params.year) {
        this.yearInput.nativeElement.value = params.year;
        this.service.reqParameters$.next({
          rating_gt: 4.3,
          'details.Year': params.year
        });
      } else if (params.searchText) {
        this.service.reqParameters$.next({
          title_ex: params.searchText
        });
      } else {
        this.service.reqParameters$.next(undefined);
      }
    });

  }

  public onSearch(text) {
    const query = {};
    if (text) {
      query['searchText'] = text;
    }
    this.router.navigate(['/movies/1'], {
      queryParams: query,
      relativeTo: this.aRoute
    });
  }

  public onYearSearch(text) {
    const query = {};
    if (text) {
      query['year'] = text;
    }
    this.router.navigate(['/movies/1'], {
      queryParams: query,
      relativeTo: this.aRoute
    });
  }

}
