import { Directive, Input, Host, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import * as d3 from 'd3';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChartComponent } from '../../chart.component';
import { ChartScaleXServiceService } from '../../chart-scale-x-service.service';

@Directive({
    selector: 'prb-scale-x-time, [prbScaleXTime]',
    providers: [
        ChartScaleXServiceService
    ]
})
export class ScaleXTimeDirective implements OnInit, OnDestroy {

    @Input() xTimeStart: Date = new Date();

    @Input() xTimeEnd: Date;

    get width(): number {
        return this.parent.width;
    }

    protected unsubscribe$ = new Subject();

    constructor(
        @Host() private parent: ChartComponent,
        private scaleXService: ChartScaleXServiceService
    ) {
        parent.update$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(this.updateXScale.bind(this));
    }

    ngOnInit(): void {
        this.updateXScale();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.xTimeStart || changes.xTimeEnd) &&  this.xTimeStart && this.xTimeEnd) {
            this.parent.updateScale$.next();
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private updateXScale() {
        console.info('app scale X update:');
        this.scaleXService.xScaleD3 = d3.scaleUtc()
            .domain([this.xTimeStart, this.xTimeEnd])
            .range([0, this.width]);
    }

}
