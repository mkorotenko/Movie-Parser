import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { PipeDataInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChartAPIService {

  constructor(
    private http: HttpClient
  ) { }

  getPipeData(pipe: number, date: Date): Observable<PipeDataInterface[]> {
    return this.http.get<PipeDataInterface[]>(`docs/${moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS')}Z/${pipe}`);
  }
}
