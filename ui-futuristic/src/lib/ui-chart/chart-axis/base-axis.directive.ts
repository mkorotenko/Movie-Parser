import { OnInit, OnDestroy } from '@angular/core';

import * as d3 from 'd3';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChartComponent } from '../chart.component';
import { ChartScaleXServiceService } from '../chart-scale-x-service.service';
import { ChartScaleYServiceService } from '../chart-scale-y-service.service';

export abstract class BaseAxisDirective implements OnInit, OnDestroy {

    protected get chart(): d3.Selection<SVGElement, unknown, null, unknown> {
        return this.parent.chart;
    }

    protected get width(): number {
        return this.parent.width;
    }

    protected get height(): number {
        return this.parent.height;
    }

    protected get xScaleD3(): d3.ScaleLinear<number, number> | d3.ScaleTime<number, number> {
        return this.scaleXService.xScaleD3;
    }

    protected get yScaleD3(): d3.ScaleLinear<number, number> | d3.ScaleTime<number, number> {
        return this.scaleYService.yScaleD3;
    }

    protected unsubscribe$ = new Subject();

    constructor(
        public parent: ChartComponent,
        protected scaleXService: ChartScaleXServiceService,
        protected scaleYService: ChartScaleYServiceService
    ) {
        this.parent.update$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(this.updateAxis.bind(this));
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    protected updateAxis() {
    }

}
