import {
  Component, ChangeDetectionStrategy, ViewChild, ElementRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { map, shareReplay } from 'rxjs/operators';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('actorInput') actorInput: ElementRef;
  @ViewChild('yearInput') yearInput: ElementRef;

  public title = 'common-site';

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
      if (params.actor) {
        this.actorInput.nativeElement.value = params.actor;
        this.yearInput.nativeElement.value = '';
        this.titleInput.nativeElement.value = '';
        this.service.reqParameters$.next({
          'details.Actors_ex': params.actor
        });
      } else if (params.year) {
        this.actorInput.nativeElement.value = '';
        this.yearInput.nativeElement.value = params.year;
        this.titleInput.nativeElement.value = '';
        this.service.reqParameters$.next({
          rating_gt: 4.3,
          'year': params.year
        });
      } else if (params.searchText) {
        this.actorInput.nativeElement.value = '';
        this.yearInput.nativeElement.value = '';
        this.titleInput.nativeElement.value = params.searchText;
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
  
  public onActorSearch(text) {
    const query = {};
    if (text) {
      query['actor'] = text;
    }
    this.router.navigate(['/movies/1'], {
      queryParams: query,
      relativeTo: this.aRoute
    });
  }
}
