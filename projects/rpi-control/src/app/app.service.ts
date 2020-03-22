import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

interface SpeedResponse {
  speed: number;
}

interface ModeResponse {
  manual: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private client: HttpClient
  ) { }

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

}
