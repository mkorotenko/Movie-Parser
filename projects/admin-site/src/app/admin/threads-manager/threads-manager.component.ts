import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'adm-threads-manager',
  templateUrl: './threads-manager.component.html',
  styleUrls: ['./threads-manager.component.scss']
})
export class ThreadsManagerComponent implements OnInit {

  threadList$: Observable<any[]> = this.admin.threadList$;
  constructor(
    private admin: AdminService
  ) { }

  ngOnInit() {
  }

}
