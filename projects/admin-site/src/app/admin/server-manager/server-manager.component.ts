import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, empty } from 'rxjs';
import { tap, shareReplay, catchError } from 'rxjs/operators';

import { ServerManagerService } from './server-manager.service';
import { AdminService } from '../admin.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'adm-server-manager',
  templateUrl: './server-manager.component.html',
  styleUrls: ['./server-manager.component.scss']
})
export class ServerManagerComponent implements OnInit {

  public parseResult = '';

  public busy$ = new BehaviorSubject(false);

  public dataSorces$ = this.admin.dataSorceList$.pipe(
    tap(list => this.dataSorce$.next((list[0] || {}).value)),
    shareReplay(1)
  );

  public dataSorce$ = new BehaviorSubject(undefined);

  constructor(
    private service: ServerManagerService,
    private admin: AdminService
  ) { }

  ngOnInit() {

  }

  public onClick(page: string) {
    this.parseResult = 'parsing...';
    this.busy$.next(true);

    this.service.parseContent({ url: this.dataSorce$.getValue(), page: page || '0' }).pipe(
      catchError(error => {
        this.busy$.next(false);
        this.parseResult = JSON.stringify(error.error);
        return empty();
      })
    ).subscribe(r => {
        console.info('Parse result:', r);
        this.parseResult = JSON.stringify(r);
        this.busy$.next(false);
      });
  }

}
//0672565305