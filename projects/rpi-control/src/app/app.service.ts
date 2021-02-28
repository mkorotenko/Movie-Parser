import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as io from 'socket.io-client';

import { Observable, Subject } from 'rxjs';

interface SpeedResponse {
  speed: number;
}

interface TemperatureResponse {
  temp: number;
}

interface FrequencyResponse {
  frequency: number;
}

interface ModeResponse {
  manual: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private socket: SocketIOClient.Socket;

  public io$: Subject<MessageEvent> = this.connect();

  constructor(
    private client: HttpClient
  ) {
    this.io$.subscribe();
  }

  private connect(): Subject<MessageEvent> {
    this.socket = io(location.host);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    const observable = new Observable(_observer => {
      this.socket.on('fan.data', (data) => {
        // console.info('app fan.data:', data);
        _observer.next({
          data
        });
      });
      this.socket.on('fan.start', (data) => {
        // console.info('app fan.start:', data);
        _observer.next({
          data
        });
      });
      this.socket.on('fan.stop', (data) => {
        // console.info('app fan.stop:', data);
        _observer.next({
          data
        });
      });
      this.socket.on('fan.error', (data) => {
        // console.info('app fan.error:', data);
        _observer.next({
          data
        });
      });

      this.socket.on('rfm69.data', (data) => {
        console.info('rfm69.data:', data);
        _observer.next({
          data
        });
      });
      this.socket.on('rfm69.error', (data) => {
        console.info('rfm69.error:', data);
        _observer.next({
          data
        });
      });
      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    console.info('Socket connected:', this);

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }

  public getSpeed(): Observable<SpeedResponse> {
    return this.client.get<SpeedResponse>(`api/fan/speed`);
  }

  public setSpeed(speed: number) {
    return this.client.post(`api/fan/speed`, { speed }).subscribe();
  }

  public getMode(): Observable<ModeResponse> {
    return this.client.get<ModeResponse>(`api/fan/mode`);
  }

  public setMode(manual: boolean) {
    return this.client.post(`api/fan/mode`, { manual }).subscribe();
  }

  public getTemperature(): Observable<TemperatureResponse> {
    return this.client.get<TemperatureResponse>(`api/core/temperature`);
  }

  public getFrequency(): Observable<FrequencyResponse> {
    return this.client.get<FrequencyResponse>(`api/core/frequency`);
  }

  public startRFM69() {
    return this.client.post(`api/rfm69/start`, { }).subscribe();
  }

}
