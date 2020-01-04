import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DBEditorService {

  constructor(
    private http: HttpClient
  ) {}

  public queryDocuments(query: { collection: string, filter: any }) {
    const par = { params: Object.assign({}, { till: 20 }, query.filter)};
    return this.http.get('api/acc/documents/' + query.collection, par);
  }

  public postDocuments(query: { collection: string, data: any }) {
    return this.http.post('api/acc/documents/' + query.collection, query.data);
  }

  public putDocuments(query: { collection: string, data: any }) {
    return this.http.put('api/acc/documents/' + query.collection, query.data);
  }

  public patchDocuments(query: { collection: string, data: any }) {
    return this.http.patch('api/acc/documents/' + query.collection, query.data);
  }

  public deleteDocuments(query: { collection: string, data: any }) {
    const par = { params: query.data };
    return this.http.delete('api/acc/documents/' + query.collection, par);
  }

}

