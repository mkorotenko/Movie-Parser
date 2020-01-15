import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public socket;

  public io$: Subject<MessageEvent> = this.connect();

  public dataSorceList$ = this.http.get('api/acc/sources').pipe(
    map(result => result || []),
    shareReplay(1)
  );

  public threadList$: Observable<any[]> = this.http.get<any[]>('api/threads/stats').pipe(
    map(result => result || []),
    shareReplay(1)
  );

  constructor(
    private http: HttpClient
  ) { }

  private connect(): Subject<MessageEvent> {
    this.socket = io(location.host);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    const observable = new Observable(_observer => {
      this.socket.on('broadcast', (data) => {
        _observer.next(data);
      });
      this.socket.on('message', (data) => {
        _observer.next(data);
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

  public parseContent(page?: string) {
    const par = (page && page !== '0') ? { params: { page: page } } : {};
    return this.http.get('api/acc/content', par);
  }

}

