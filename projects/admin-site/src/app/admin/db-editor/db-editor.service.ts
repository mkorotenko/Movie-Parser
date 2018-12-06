import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DBEditorService {

  constructor(
    private http: HttpClient
  ) {}

  public queryDocuments(query: any) {
    const par = { params: Object.assign({}, { till: 20 }, query)};
    return this.http.get('api/acc/movies', par);
  }

  public putDocuments(query: any) {
    // const par = { params: query };
    return this.http.put('api/acc/movies', query);
  }

  public deleteDocuments(query: any) {
    const par = { params: query };
    return this.http.delete('api/acc/movies', par);
  }

}

