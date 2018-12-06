import { Component, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SourceParserService } from './source-parser.service';

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

  public dataSorce = this.service.dataSorceList[0].value;

  public code = ``;

  public busy$ = new BehaviorSubject(false);

  public dataSorces = this.service.dataSorceList;

  constructor(
    private service: SourceParserService
  ) { }

  ngOnInit() {
    console.info(this);
  }

  onInit(editor) {
    const line = editor.getPosition();
  }

  public onGetParser() {
    this.service.getParser(this.dataSorce)
    .subscribe(res => {
      console.info('Get parser: ', res);
      this.listParser._editor.setValue(res[0].listParser);
    });
  }

  public onPostParser() {
    const parserCode = this.listParser._editor.getValue();

    if (parserCode) {
      const data = {
        'url': this.dataSorce,
        'listParser': parserCode,
        'parser': ''
      };
      this.service.putParser(data)
        .subscribe(res => console.info('Put parser: ', res));
    }

  }
}
