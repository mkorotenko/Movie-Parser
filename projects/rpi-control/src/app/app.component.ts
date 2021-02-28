import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';
import { shareReplay, map, switchMap } from 'rxjs/operators';

import { AppService } from './app.service';

const MAX_LIST_LENGTH = 25;

@Component({
  selector: 'rpi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

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

  private tempList: Array<{ x: Date, y: Number }> = [];

  tempData$ = this.currentTemp$.pipe(
    switchMap(temp => {
      if (this.tempList.length >= MAX_LIST_LENGTH) {
        this.tempList.shift();
      }
      this.tempList.push({
        x: new Date(),
        y: temp
      });
      return of(this.tempList);
    }),
    shareReplay(1)
  );

  private freqList: Array<{ x: Date, y: Number }> = [];

  freqData$ = this.currentFreq$.pipe(
    switchMap(freq => {
      if (this.freqList.length >= MAX_LIST_LENGTH) {
        this.freqList.shift();
      }
      this.freqList.push({
        x: new Date(),
        y: freq
      });
      return of(this.freqList);
    }),
    shareReplay(1)
  );

  timeStart$ = this.tempData$.pipe(
    map(() => {
      if (!this.tempList.length) {
        return new Date();
      }
      return this.tempList[0].x;
    }),
    shareReplay(1)
  );

  timeEnd$ = this.tempData$.pipe(
    map(() => {
      if (!this.tempList.length) {
        return new Date();
      }
      return this.tempList[this.tempList.length - 1].x;
    }),
    shareReplay(1)
  );

  loadError$ = of(undefined);

  tempGradient = [
    {
        color: '#ce6c44',
        value: 0
    },
    {
        color: '#c29b3f',
        value: 30
    },
    {
        color: '#4bc260',
        value: 50
    },
    {
        color: '#65d1b4',
        value: 65
    },
    {
        color: '#074bed',
        value: 100
    },
  ];

  freqGradient = [
    {
        color: '#ce6c44',
        value: 700
    },
    {
        color: '#c29b3f',
        value: 850
    },
    {
        color: '#4bc260',
        value: 1000
    },
    {
        color: '#65d1b4',
        value: 1200
    },
    {
        color: '#074bed',
        value: 1400
    },
  ];

  constructor(
    private service: AppService
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.checkTemp$.next({});
      this.checkFreq$.next({});
    }, 5000);
  }

  onSpeedChange(speed: string): void {
    this.service.setSpeed(Number(speed));
  }

  onModeChange(manual: boolean): void {
    this.service.setMode(manual);
  }

  onCheckTemp(): void {
    this.checkTemp$.next({});
  }

  onCheckFreq(): void {
    this.checkFreq$.next({});
  }

  onStartChange(start: boolean): void {
    if (start) {
      this.service.startRFM69();
    }
  }

}
