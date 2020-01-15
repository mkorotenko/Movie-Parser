import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

export interface RequestParams {
    url: string;
    page?: string;
    path?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServerManagerService {

  constructor(
    private http: HttpClient
  ) {}

  public parseContent(data: RequestParams) {
    return this.http.get('api/acc/content', { params: data as any});
  }

}

