import { Component, ChangeDetectionStrategy } from '@angular/core';

import { shareReplay, map } from 'rxjs/operators';

import { AppService } from './app.service';

@Component({
  selector: 'rpi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  currentSpped$ = this.service.getSpeed().pipe(
    map(res => res.speed),
    shareReplay(1)
  );
  manualMode$ = this.service.getMode().pipe(
    map(mode => mode.manual),
    shareReplay(1)
  );

  constructor(
    private service: AppService
  ) {}

  onSpeedChange(speed: string) {
    this.service.setSpeed(Number(speed));
  }

  onModeChange(manual: boolean) {
    this.service.setMode(manual);
  }

}
