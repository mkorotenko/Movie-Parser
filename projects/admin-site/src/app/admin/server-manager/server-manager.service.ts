import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerManagerService {

  constructor(
    private http: HttpClient
  ) {}

  public parseContent(data: { url: string; page?: string }) {
    return this.http.get('api/acc/content', { params: data });
  }

}

