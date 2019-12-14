import { Component } from '@angular/core';

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
export class ServerManagerComponent {

  public parseResult: any = '';

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

  public onClick(page: string, template?: string) {
    this.parseResult = 'parsing...';
    this.busy$.next(true);

    const param = {
      url: this.dataSorce$.getValue()
    };

    if (template && !template.includes('${page}')) {
      param['path'] = template;
    } else {
      if (template) {
        param['path'] = template.replace('${page}', page || '0');
      } else {
        param['page'] = page || '0';
      }
    }

    this.service.parseContent(param)
      .subscribe(r => {
          console.info('Parse result:', r);
          this.parseResult = r; // JSON.stringify(r);
          this.busy$.next(false);
        },
        error => {
          this.busy$.next(false);
          this.parseResult = error.error; // JSON.stringify(error.error);
        });
  }

}
