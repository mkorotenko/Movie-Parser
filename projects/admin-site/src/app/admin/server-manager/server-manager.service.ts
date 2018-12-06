import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerManagerService {

  constructor(
    private http: HttpClient
  ) {}

  public parseContent(page?: string) {
    const par = (page && page !== '0' ) ? { params: { page: page } } : {};
    return this.http.get('api/acc/content', par);
  }

}

