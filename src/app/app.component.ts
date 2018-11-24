import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { AppService } from './app.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  @ViewChild('yearInput') yearInput: ElementRef;

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

  public onYearSearch(text) {
    const searchYear = text.target.value;
    if (searchYear && searchYear.length === 4) {
      this.service.reqParameters$.next({
        rating_gt: 4.3,
        'details.Year': searchYear
      });
    } else {
      this.service.reqParameters$.next(undefined);
    }
  }

}
