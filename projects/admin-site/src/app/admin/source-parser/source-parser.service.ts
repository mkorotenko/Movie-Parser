import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AdminService } from '../admin.service';

@Injectable({
  providedIn: 'root'
})
export class SourceParserService {

  public dataSorceList = this.admin.dataSorceList;

  constructor(
    private http: HttpClient,
    private admin: AdminService
  ) {}

  public getParser(parser: string) {
    const par = { params: { url: parser } };
    return this.http.get('api/acc/parser', par);
  }

  public putParser(data) {
    return this.http.post('api/acc/parser', data);
  }

}

