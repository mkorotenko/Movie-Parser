import { Component, OnInit } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';

import { AdminService } from '../admin.service';
import { filter } from 'rxjs/operators';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'adm-threads-manager',
    templateUrl: './threads-manager.component.html',
    styleUrls: ['./threads-manager.component.scss']
})
export class ThreadsManagerComponent implements OnInit {

    threadList$: Observable<any[]> = this.admin.threadList$;

    appMessages$ = this.admin.io$.pipe(
        filter((thread: any) => thread._id),
    )

    constructor(
        private admin: AdminService
    ) { }

    ngOnInit() {
        this.appMessages$.subscribe(message => {
            if (message.level === 'error') {
                console.error(message.message);
            } else {
                console.info(message.message);
            }
        });
    }
    onStart() {
        this.admin.socket.emit('message', JSON.stringify({
            runApps: true
        }));
    }

    onStop() {
        this.admin.socket.emit('message', JSON.stringify({
            runApps: false
        }));
    }

}
