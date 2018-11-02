import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from './app.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public title = 'nice-kinogo';
  public pages$ = this.service.movieCount$.pipe(
    map(count => Math.round(count / 20 + .5)),
    map(count => {
      const res = new Array(count);
      for (let i = 0; i < count; i++) {
        res[i] = i + 1;
      }
      return res;
    })
  );

  constructor(
    private service: AppService
  ) {}

  public onSearch(text) {
    const searchText = text.target.value;
    if (searchText && searchText.length > 1) {
      this.service.reqParameters$.next({
        title_ex: searchText
      });
    } else {
      this.service.reqParameters$.next(undefined);
    }
  }

}
