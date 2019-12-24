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
    this.client.emit('sendToSerial', [3, 0, pipe, 0, this.encodeDate(new Date())]);
  }

  setPeriod(pipe: number, period: number) {
    this.client.emit('sendToSerial', [5, 0, pipe, 0, period, 0, 0, 0]);
  }

  changePipeNumber(pipe: number, newPipe: number) {
    this.client.emit('sendToSerial', [6, 0, pipe, 0, newPipe, 0, 0, 0]);
  }

  setVoltage(pipe: number, voltage: number) {
    this.client.emit('sendToSerial', [9, 0, pipe, 0, voltage, 0, 0, 0]);
  }

  private encodeDate(date: Date): number {
    let zipDate: number;
    zipDate = date.getFullYear() - 2000;
    zipDate = zipDate << 4;
    zipDate += date.getMonth() + 1;
    zipDate = zipDate << 5;
    zipDate += date.getDate();
    zipDate = zipDate << 5;
    zipDate += date.getHours();
    zipDate = zipDate << 6;
    zipDate += date.getMinutes();
    zipDate = zipDate << 6;
    zipDate += date.getSeconds();
    return zipDate;
  }
}
