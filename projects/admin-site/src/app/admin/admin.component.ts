import { Component, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AdminService } from './admin.service';
import { map } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'adm-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public parseResult = '';

  public busy$ = new BehaviorSubject(false);

  public activeTab$ = new BehaviorSubject(0);

  private _dbEditorFetch = false;
  public isDBEditor$ = this.activeTab$.pipe(
    map(tabNum => {
      if (!this._dbEditorFetch && tabNum === 1) {
        this._dbEditorFetch = true;
      }

      return this._dbEditorFetch;
    })
  );

  private _sourceParserFetch = false;
  public isSourceParser$ = this.activeTab$.pipe(
    map(tabNum => {
      if (!this._sourceParserFetch && tabNum === 2) {
        this._sourceParserFetch = true;
      }

      return this._sourceParserFetch;
    })
  );

  public dataSorces = this.service.dataSorceList;

  constructor(
    private service: AdminService
  ) { }

  ngOnInit() {
    this.service.io$.subscribe(d => console.info('IO data', d));
  }

  public onClick(page: string) {
    this.parseResult = 'parsing...';
    this.busy$.next(true);

    this.service.parseContent(page || '0')
      .subscribe(r => {
        this.parseResult = JSON.stringify(r);
        this.busy$.next(false);
      });
  }

}
