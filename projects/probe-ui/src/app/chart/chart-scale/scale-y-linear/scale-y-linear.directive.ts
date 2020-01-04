import { Directive, Input, Host, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import * as d3 from 'd3';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChartComponent } from '../../chart.component';
import { ChartScaleYServiceService } from '../../chart-scale-y-service.service';

@Directive({
    selector: 'prb-scale-y-linear, [prbScaleYLinear]',
    providers: [
        ChartScaleYServiceService
    ]
})
export class ScaleYLinearDirective implements OnInit, OnDestroy {

    @Input() yScaleStart: number = 0;

    @Input() yScaleEnd: number = 1;

    get height(): number {
        return this.parent.height;
    }

    protected unsubscribe$ = new Subject();

    constructor(
        @Host() private parent: ChartComponent,
        private scaleYService: ChartScaleYServiceService
    ) {
        parent.update$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(this.updateYScale.bind(this));
    }

    ngOnInit(): void {
        this.updateYScale();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.yScaleStart || changes.yScaleEnd) && this.yScaleStart && this.yScaleEnd) {
            this.parent.updateScale$.next();
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private updateYScale() {
        console.info('app scale Y update:');
        this.scaleYService.yScaleD3 = d3.scaleLinear()
            .domain([this.yScaleEnd, this.yScaleStart])
            .range([0, this.height]);
    }

}
