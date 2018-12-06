import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../admin.service';

@Injectable({
  providedIn: 'root'
})
export class DBEditorService {

  public dataSorceList = this.admin.dataSorceList;

  constructor(
    private http: HttpClient,
    private admin: AdminService
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

