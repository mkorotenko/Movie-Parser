import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private socket;

  public io$: Subject<MessageEvent> = this.connect();

  constructor(
    private http: HttpClient
  ) {}

  private connect(): Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
    this.socket = io(environment.api_path);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    const observable = new Observable(_observer => {
        this.socket.on('broadcast', (data) => {
          // console.log('Received message from Websocket Server');
          _observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    const observer = {
        next: (data: Object) => {
            this.socket.emit('message', JSON.stringify(data));
        },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }

  public parseContent(page?: string) {
    const par = (page && page !== '0' ) ? { params: { page: page } } : {};
    return this.http.get('api/acc/content', par);
  }

}

