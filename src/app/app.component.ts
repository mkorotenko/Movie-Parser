import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from './app.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public title = 'nice-kinogo';
  public count$ = this.service.movieCount$.pipe(
    map(count => Math.round(count / 20 + .5))
  );

  constructor(
    private service: AppService,
    private route: ActivatedRoute
  ) {}

}
