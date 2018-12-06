import { Component, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { DBEditorService } from './db-editor.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'adm-db-editor',
  templateUrl: './db-editor.component.html',
  styleUrls: ['./db-editor.component.scss']
})
export class DBEditorComponent implements OnInit {

  @ViewChild('editor') editor: any;

  public editorOptions = {
    theme: 'vs-dark',
    language: 'json'
  };

  public code = `{}`;

  public busy$ = new BehaviorSubject(false);

  public  = this.service.dataSorceList;

  onInit(editor) {
    const line = editor.getPosition();
  }

  constructor(
    private service: DBEditorService
  ) { }

  ngOnInit() {
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
    this.busy$.next(true);
    const data = JSON.parse(this.code);
    this.service.putDocuments(data)
      .subscribe((code: { count: Number, docs: any[], filter: any }) => {
        this.busy$.next(false);
        console.info('on update', code);
      });
  }

  public onDelete() {
    this.busy$.next(true);
    const ids = JSON.parse(this.code).map(d => d._id);
    this.service.deleteDocuments(ids)
      .subscribe((code: { count: Number, docs: any[], filter: any }) => {
        this.code = '';
        this.busy$.next(false);
      });
  }
}
