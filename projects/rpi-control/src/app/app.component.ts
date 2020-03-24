import { Component, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { shareReplay, map, switchMap } from 'rxjs/operators';

import { AppService } from './app.service';

@Component({
  selector: 'rpi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  private checkTemp$ = new BehaviorSubject({});

  private checkFreq$ = new BehaviorSubject({});

  currentSpped$ = this.service.getSpeed().pipe(
    map(res => res.speed),
    shareReplay(1)
  );
  manualMode$ = this.service.getMode().pipe(
    map(mode => mode.manual),
    shareReplay(1)
  );

  currentTemp$ = this.checkTemp$.pipe(
    switchMap(() => {
      return this.service.getTemperature();
    }),
    map(res => res.temp),
    shareReplay(1)
  );

  currentFreq$ = this.checkFreq$.pipe(
    switchMap(() => {
      return this.service.getFrequency();
    }),
    map(res => res.frequency),
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

  onCheckTemp() {
    this.checkTemp$.next({});
  }

  onCheckFreq() {
    this.checkFreq$.next({});
  }

}
