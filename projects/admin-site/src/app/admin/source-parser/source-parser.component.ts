import { Component, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SourceParserService } from './source-parser.service';
import { AdminService } from '../admin.service';
import { tap, shareReplay } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'adm-source-parser',
  templateUrl: './source-parser.component.html',
  styleUrls: ['./source-parser.component.scss']
})
export class SourceParserComponent implements OnInit {

  @ViewChild('listParser') listParser: any;

  public editorOptions = {
    theme: 'vs-dark',
    language: 'javascript'
  };

  public code = ``;

  public busy$ = new BehaviorSubject(false);

  public dataSorces$ = this.admin.dataSorceList$.pipe(
    tap(list => this.dataSorce$.next(list[0])),
    shareReplay(1)
  );

  public dataSorce$ = new BehaviorSubject(undefined);

  constructor(
    private service: SourceParserService,
    private admin: AdminService
  ) { }

  ngOnInit() {
    console.info(this);
  }

  onInit(editor) {
    const line = editor.getPosition();
  }

  public onGetParser() {
    this.busy$.next(true);
    this.service.getParser(this.dataSorce$.getValue().value)
      .subscribe((res: any) => {
        console.info('Get parser: ', res);
        this.listParser._editor.setValue(res.listParser);
        this.busy$.next(false);
      });
  }

  public onPostParser() {
    const parserCode = this.listParser._editor.getValue();

    this.busy$.next(true);
    const source = this.dataSorce$.getValue();
    const data = {
      'url': source.value,
      'description': source.description,
      'listParser': parserCode || '',
      'parser': ''
    };
    this.service.putParser(data)
      .subscribe(res => {
        this.busy$.next(false);
        console.info('Put parser: ', res);
      });

  }
}
