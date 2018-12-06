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

  @ViewChild('editor') editor: any;

  public editorOptions = {
    theme: 'vs-dark',
    language: 'json'
  };

  public code = `{}`;

  public parseResult = '';

  public busy$ = new BehaviorSubject(false);

  public activeTab$ = new BehaviorSubject(0);

  public dataSorces = [
    {
      description: 'Kinogo',
      value: 'kinogo.cc'
    }
  ];

  onInit(editor) {
    const line = editor.getPosition();
  }

  constructor(
    private service: AdminService
  ) { }

  ngOnInit() {
    console.info('admin', this);
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

  public onQuery(filter: string) {
    this.busy$.next(true);
    this.service.queryDocuments(JSON.parse(filter))
      .subscribe((code: { count: Number, docs: any[], filter: any }) => {
        this.busy$.next(false);
        this.code = JSON.stringify(code.docs);
        console.info('query:', code.docs, this.editor);
      });
  }

  public onUpdate() {
    const data = JSON.parse(this.code);
    this.service.putDocuments(data)
      .subscribe((code: { count: Number, docs: any[], filter: any }) => {
        console.info('on update', code);
      });
  }

  public onDelete() {
    const ids = JSON.parse(this.code).map(d => d._id);
    this.service.deleteDocuments(ids)
      .subscribe((code: { count: Number, docs: any[], filter: any }) => {
        this.code = '';
      });
  }
}
