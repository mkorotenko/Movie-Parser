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

  public parseContent(page?: string) {
    const par = (page && page !== '0' ) ? { params: { page: page } } : {};
    return this.http.get('api/acc/content', par);
  }

}

