import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

export interface SocketMessageInterface {
  pipe: number;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  client = io(location.host);

  private dataSource$: BehaviorSubject<SocketMessageInterface> = new BehaviorSubject(undefined);
  data$: Observable<SocketMessageInterface> = this.dataSource$.asObservable();

  constructor() {
    this.client.on('newData', data => this.dataSource$.next(data));
  }

  setDebugMode(debug: boolean) {
    this.client.emit('debugMode', debug);
  }

  updateTime(pipe: number) {
    this.client.emit('sendToSerial', [3, pipe, 0, 0, this.encodeDate(new Date())]);
  }

  setPeriod(pipe: number, period: number) {
    this.client.emit('sendToSerial', [5, pipe, 0, 0, period, 0, 0, 0]);
  }

  changePipeNumber(pipe: number, newPipe: number) {
    this.client.emit('sendToSerial', [6, pipe, 0, 0, newPipe, 0, 0, 0]);
  }

  setVoltage(pipe: number, voltage: number) {
    this.client.emit('sendToSerial', [9, pipe, 0, 0, voltage, 0, 0, 0]);
  }

  resetPipe(pipe: number) {
    this.client.emit('sendToSerial', [11, pipe, 0, 0, 0, 0, 0, 0]);
  }

  private encodeDate(date: Date): number {
    let zipDate: number;
    zipDate = date.getUTCFullYear() - 2000;
    zipDate = zipDate << 4;
    zipDate += date.getUTCMonth() + 1;
    zipDate = zipDate << 5;
    zipDate += date.getUTCDate();
    zipDate = zipDate << 5;
    zipDate += date.getUTCHours();
    zipDate = zipDate << 6;
    zipDate += date.getUTCMinutes();
    zipDate = zipDate << 6;
    zipDate += date.getUTCSeconds();
    return zipDate;
  }
}
