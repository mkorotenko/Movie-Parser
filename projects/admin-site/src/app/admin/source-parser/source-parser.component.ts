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

  public parseResult = '';

  public busy$ = new BehaviorSubject(false);

  public dataSorces = this.service.dataSorceList;

  constructor(
    private service: SourceParserService
  ) { }

  ngOnInit() {
  }

}
