import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AdminService } from './admin.service';
import { map, filter } from 'rxjs/operators';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'adm-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

    public parseResult = '';

    public busy$ = new BehaviorSubject(false);

    public activeTab$ = new BehaviorSubject(0);

    private _dbEditorFetch = false;
    public isDBEditor$ = this.activeTab$.pipe(
        map(tabNum => {
            if (!this._dbEditorFetch && tabNum === 1) {
                this._dbEditorFetch = true;
            }

            return this._dbEditorFetch;
        })
    );

    private _sourceParserFetch = false;
    public isSourceParser$ = this.activeTab$.pipe(
        map(tabNum => {
            if (!this._sourceParserFetch && tabNum === 2) {
                this._sourceParserFetch = true;
            }

            return this._sourceParserFetch;
        })
    );

    private _applications = false;
    public isApplications$ = this.activeTab$.pipe(
        map(tabNum => {
            if (!this._applications && tabNum === 3) {
                this._applications = true;
            }

            return this._applications;
        })
    );

    socket$ = this.service.io$.pipe(
        filter((message: any) => !message._id)
    );

    constructor(
        private service: AdminService
    ) { }

    ngOnInit() {
        this.socket$.subscribe(message => {
            if (message.level === 'error') {
                console.error('~', message.message ? message.message : message);
            } else {
                console.info('~', message.message ? message.message : message);
            }
        });
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

}
