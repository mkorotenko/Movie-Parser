import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nc-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public editorOptions = {
    theme: 'vs-dark',
    language: 'json'
  };

  public code = `
    {
      "range": 4.9,
      "description": "some text"
    }
  `;

  onInit(editor) {
    const line = editor.getPosition();
    console.log(line);
  }

  constructor(
    private service: AdminService
  ) { }

  ngOnInit() {
    console.info('AdminService', this.service);
    this.service.io$.subscribe(d => console.info('IO data', d));
  }

  public onClick(page: string) {
    this.service.parseContent(page || '0')
      .subscribe(r => console.info('Parse result:', r));
  }
}
