import {
    Component, OnInit, Input, OnChanges, SimpleChanges,
    OnDestroy, EventEmitter, Output, ChangeDetectionStrategy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Observable, BehaviorSubject, combineLatest, Subject, of } from 'rxjs';
import { switchMap, filter, shareReplay, map, takeUntil, distinctUntilChanged, take, catchError } from 'rxjs/operators';
import * as moment from 'moment';

import { SocketService, SocketMessageInterface } from './socket.service';
// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ChartAPIService } from '../services/chart-api.service';
import { EditPipeDialogComponent } from '../edit-pipe-dialog/edit-pipe-dialog.component';
import { PipeDataInterface } from '../interfaces';

const TIME_RANGE = 6 * 60 * 60 * 1000;
const MAX_BAT_V = 4.7;
const MIN_BAT_V = 3.0;

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
        map(data => {
            return data.filter(item => item.pack_type === 2)
        }),
        shareReplay(1),
    );

    tempData$ = this.data$.pipe(
        map(data => data.map(d => ({
                x: new Date(d.date),
                y: Math.max(d.temp, 15)
            }))
        ),
    );

    tempGradient = [
        {
            color: '#ce6c44',
            value: 0
        },
        {
            color: '#c29b3f',
            value: 30
        },
        {
            color: '#4bc260',
            value: 50
        },
        {
            color: '#65d1b4',
            value: 65
        },
        {
            color: '#074bed',
            value: 100
        },
    ];

    humData$ = this.data$.pipe(
        map(data => data.map(d => ({
                x: new Date(d.date),
                y: Math.max(d.hum, 20)
            }))
        ),
    );

    humGradient = [
        {
            color: '#67a5f6',
            value: 20
        },
        {
            color: '#b5ffbb',
            value: 50
        },
        {
            color: '#f1f642',
            value: 80
        },
    ];

    loadError$ = this.tempData$.pipe(
        catchError(error => {
            return of(error);
        })
    );

    timeStart$ = this.tempData$.pipe(
        map(d => d[0].x),
    );

    timeEnd$ = this.tempData$.pipe(
        map(d => d[d.length - 1].x),
    );

    rssiDB$: Observable<number> = this.data$.pipe(
        filter(data => !!(data && data.length)),
        map(data => data[data.length - 1].rssi),
        distinctUntilChanged(),
    );

    batteryVolt$: Observable<number> = this.data$.pipe(
        filter(data => !!(data && data.length)),
        map(data => data[data.length - 1].bat_v),
        distinctUntilChanged(),
    );

    batteryPerc$: Observable<number> = this.batteryVolt$.pipe(
        map(batteryVolt => Math.round(((batteryVolt - MIN_BAT_V) / (MAX_BAT_V - MIN_BAT_V)) * 100))
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
        this.date$.next(new Date(cDate.getTime() - TIME_RANGE));
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

    onResetPipe(pipe: number) {
        this.socketService.resetPipe(pipe);
    }
}
