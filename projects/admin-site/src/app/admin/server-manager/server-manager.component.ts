import { Component } from '@angular/core';

import { BehaviorSubject, Subject, of, combineLatest } from 'rxjs';
import { tap, shareReplay, catchError, switchMap, map, filter } from 'rxjs/operators';

import { ServerManagerService, RequestParams } from './server-manager.service';
import { AdminService } from '../admin.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'adm-server-manager',
    templateUrl: './server-manager.component.html',
    styleUrls: ['./server-manager.component.scss']
})
export class ServerManagerComponent {

    public busy$ = new BehaviorSubject(false);

    public dataSources$ = this.admin.dataSorceList$.pipe(
        tap(list => this.dataSource$.next((list[0] || {}).value)),
        shareReplay(1)
    );

    public dataSource$ = new BehaviorSubject(undefined);

    private requestParams$ = new Subject<RequestParams[]>();

    private parseContentData$ = this.requestParams$.pipe(
        tap(() => this.busy$.next(true)),
        switchMap(params => combineLatest(
            params.map(param => this.service.parseContent(param)))
        ),
        tap(() => this.busy$.next(false)),
        map(rawData => {
            let aNew = [], aUpdate = [], aCount = 0, aPath = '';
            aPath = rawData[0][0].path;
            if (rawData.length > 1) {
                aPath = `${aPath} - ${rawData[rawData.length - 1][0].path}`;
            }
            rawData.forEach(pageData => {
                aNew = aNew.concat(pageData[0].new);
                aUpdate = aUpdate.concat(pageData[0].update);
                aCount += pageData[0].count;
            });
            return {
                new: aNew,
                update: aUpdate,
                count: aCount,
                path: aPath
            };
        }),
        shareReplay(1)
    );

    public newRecords$ = this.parseContentData$.pipe(
        map(data => (data && data.new || []).sort((a, b) => ((b.rating || 0) - (a.rating || 0))))
    );

    public updatedRecords$ = this.parseContentData$.pipe(
        map(data => (data && data.update || []).sort((a, b) => ((b.rating || 0) - (a.rating || 0))))
    );

    public recordsProcessed$ = this.parseContentData$.pipe(
        map(data => data.count)
    );

    public pathProcessed$ = this.parseContentData$.pipe(
        map(data => data.path)
    );

    public parseError$ = this.parseContentData$.pipe(
        catchError(error => {
            this.busy$.next(false);
            return of(error.message);
        }),
        filter(error => typeof error === 'string')
    );

    constructor(
        private service: ServerManagerService,
        private admin: AdminService
    ) { }

    public async onClick(pageStart: string, pageEnd: string, template?: string) {

        const requestParams = [];
        const param = {
            url: this.dataSource$.getValue()
        };

        if (template) {
            if (!template.includes('${page}')) {
                param['path'] = template;
                requestParams.push(param);
            } else {
                const start = Number(pageStart),
                    end = Number(pageEnd);
                for (let page = start; page <= end; page++) {
                    param['path'] = template.replace('${page}', `${page}` || '0');
                    requestParams.push({
                        ...param
                    });
                }
            }
        } else {
            param['page'] = pageStart || '0';
            requestParams.push(param);
        }

        this.requestParams$.next(requestParams);
    }

}
