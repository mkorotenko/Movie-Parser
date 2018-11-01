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
    tap(param => this.service.pageParameters$.next((Number(param.id || 1)))),
    switchMap(() => this.service.rootContent$),
    shareReplay(1)
  );

  constructor(
    private service: AppService,
    private route: ActivatedRoute
  ) { }

}
