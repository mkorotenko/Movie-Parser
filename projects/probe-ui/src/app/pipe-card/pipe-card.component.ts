import {
    Component, OnInit, Input, OnChanges, SimpleChanges,
    OnDestroy, EventEmitter, Output, ChangeDetectionStrategy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { switchMap, filter, shareReplay, map, takeUntil, distinctUntilChanged, take, tap, startWith } from 'rxjs/operators';

import { ChartAPIService } from '../services/chart-api.service';
import { SocketService, SocketMessageInterface } from './socket.service';
// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { EditPipeDialogComponent } from '../edit-pipe-dialog/edit-pipe-dialog.component';
import * as d3 from 'd3';
import { PipeDataInterface } from '../interfaces';


@Component({
    selector: 'app-pipe-card',
    templateUrl: './pipe-card.component.html',
    styleUrls: ['./pipe-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
    // providers: [
    //   {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    //   {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    // ],
})
export class PipeCardComponent implements OnInit, OnChanges, OnDestroy {

    @Input() pipe: number;
    @Output() delete: EventEmitter<number> = new EventEmitter();

    private pipe$: BehaviorSubject<number> = new BehaviorSubject(undefined);
    private date$: BehaviorSubject<Date> = new BehaviorSubject(undefined);

    private newData$: Observable<SocketMessageInterface> = this.socketService.data$.pipe(
        filter(data => data && data.pipe === this.pipe)
    );

    date = new FormControl(moment());

    data$: Observable<Array<PipeDataInterface>> = combineLatest(
        this.pipe$,
        this.date$
    ).pipe(
        filter(([pipe, date]) => !!pipe && !!date),
        switchMap(([pipe, date]) => this.serviceAPI.getPipeData(pipe, date)),
        // map(data => data.filter(d => d.hum > 1)),
        shareReplay(1),
    );

    yScale = 30;  //this.testData.reduce((res, value) => Math.max(res, value), 0);

    testData = Array(14).fill(undefined)
        .map(() =>
            d3.randomUniform(this.yScale)()
        );

    xScale = this.testData.length - 1;

    tempData$ = this.data$.pipe(
        map(d => d.slice(0, 14)),
        // map(d => d.map(i => i.temp)),
        // startWith(Array(11).fill(0))
        map(data => data.map(d => ({
            x: new Date(d.date),
            y: d.temp
        })))
    )

    timeStart$ = this.tempData$.pipe(
        map(d => d[0].x)
    )

    timeEnd$ = this.tempData$.pipe(
        map(d => d[d.length - 1].x)
    )

    rssiDB$: Observable<number> = this.data$.pipe(
        filter(data => !!(data && data.length)),
        map(data => data[data.length - 1].tx_res),
        distinctUntilChanged(),
    );

    batteryVolt$: Observable<number> = this.data$.pipe(
        filter(data => !!(data && data.length)),
        map(data => data[data.length - 1].bat_v),
        distinctUntilChanged(),
    );

    batteryPerc$: Observable<number> = this.batteryVolt$.pipe(
        map(batteryVolt => Math.round(((batteryVolt - 3.5) / (5 - 3.5)) * 100))
    );

    private destroy$: Subject<void> = new Subject();

    constructor(
        private serviceAPI: ChartAPIService,
        private socketService: SocketService,
        private dialog: MatDialog,
    ) {
    }
    ngOnInit() {
        this.newData$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => this.onUpdate());

        this.date.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => this.onUpdate());

        this.onUpdate();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.pipe) {
            this.pipe$.next(this.pipe);
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    onUpdate() {
        const cDate = new Date();
        this.date$.next(new Date(cDate.getTime() - 6 * 60 * 60 * 1000));
    }

    onUpdateTime(pipe: number) {
        this.socketService.updateTime(pipe);
    }

    onChangePipe(pipe: number) {
        const dialogRef = this.dialog.open(EditPipeDialogComponent, {
            width: '250px',
            data: {}
        });

        dialogRef.afterClosed().pipe(
            take(1)
        ).subscribe(result => {
            if (result) {
                const newPipe: number = Number(result);
                this.socketService.changePipeNumber(pipe, newPipe);
            }
        });
    }

    onSetPeriod(pipe: number) {
        const dialogRef = this.dialog.open(EditPipeDialogComponent, {
            width: '250px',
            data: {}
        });

        dialogRef.afterClosed().pipe(
            take(1)
        ).subscribe(result => {
            if (result) {
                const period: number = Number(result);
                this.socketService.setPeriod(pipe, period);
            }
        });
    }

    onSetVoltage(pipe: number) {
        const dialogRef = this.dialog.open(EditPipeDialogComponent, {
            width: '250px',
            data: {}
        });

        dialogRef.afterClosed().pipe(
            take(1)
        ).subscribe(result => {
            if (result) {
                const voltage: number = Number(result);
                this.socketService.setVoltage(pipe, voltage);
            }
        });
    }
}
