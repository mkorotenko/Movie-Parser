import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'adm-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public editorOptions = {
    theme: 'vs-dark',
    language: 'json'
  };

  public code = `{}`;

  public parseResult = '';

  public busy$ = new BehaviorSubject(false);

  onInit(editor) {
    const line = editor.getPosition();
  }

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

  public onQuery(filter: string) {
    this.service.queryDocuments(JSON.parse(filter))
      .subscribe((code: { count: Number, docs: any[], filter: any }) => {
        this.code = JSON.stringify(code.docs);
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
