import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, shareReplay, tap } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nc-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {

  public title = 'nice-kinogo';
  public data$ = this.route.params.pipe(
    tap(param => this.service.reqParameters$.next({
      rating_gt: 4.8,
      'details.Genre_or': ['Фэнтези', 'Боевик'],
      from: (Number(param.id || 1) - 1) * 20,
      till: 20
    })),
    switchMap(() => this.service.rootContent$),
    shareReplay(1)
  );

  // public f = this.route.params
  //   .subscribe( p => console.info('params', p));

  constructor(
    private service: AppService,
    private route: ActivatedRoute
  ) {
    // const page = Number(route.snapshot.paramMap.get('id') || '1');
    // this.service.reqParameters$.next({
    //   rating_gt: 4.8,
    //   'details.Genre_or': ['Фэнтези', 'Боевик'],
    //   from: (page - 1) * 20,
    //   till: 20
    // });
  }

}
