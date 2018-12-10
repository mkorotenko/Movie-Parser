import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SourceParserService {

  constructor(
    private http: HttpClient,
  ) {}

  public getParser(parser: string) {
    const par = { params: { url: parser } };
    return this.http.get('api/acc/parser', par);
  }

  public testParser(data, url) {
    return this.http.post('api/acc/parserTest', data, { params: <any>{ page: 1, url: url } });
  }

  public putParser(data) {
    return this.http.post('api/acc/parser', data);
  }

}

