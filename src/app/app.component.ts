import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public title = 'nice-kinogo';
  public data$ = this.service.rootContent;

  constructor(
    private service: AppService
  ) {}

}
