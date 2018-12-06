import { Component, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AdminService } from './admin.service';

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

  public dataSorces = [
    {
      description: 'Kinogo',
      value: 'kinogo.cc'
    }
  ];

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
