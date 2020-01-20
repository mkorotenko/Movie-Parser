import { Component, OnInit } from '@angular/core';

import { Observable, combineLatest, Subject } from 'rxjs';

import { AdminService } from '../admin.service';
import { filter, switchMap, map, shareReplay, debounceTime } from 'rxjs/operators';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'adm-threads-manager',
    templateUrl: './threads-manager.component.html',
    styleUrls: ['./threads-manager.component.scss']
})
export class ThreadsManagerComponent implements OnInit {

    private getData$ = new Subject();

    threadList$: Observable<any[]> = this.getData$.pipe(
        switchMap(() => this.admin.getThreadList()),
        map(result => result || []),
        shareReplay(1)
    );

    appMessages$ = this.admin.io$.pipe(
        filter((thread: any) => thread._id),
    );

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

        setTimeout(() => {
            this.getData$.next();
        }, 500);

        this.appMessages$.pipe(
            debounceTime(300)
        ).subscribe(() => this.getData$.next());
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
