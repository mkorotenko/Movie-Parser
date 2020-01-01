import { OnInit, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChartComponent } from '../chart.component';

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
        return this.parent.xScaleD3;
    }

    protected get yScaleD3(): d3.ScaleLinear<number, number> {
        return this.parent.yScaleD3;
    }

    protected unsubscribe$ = new Subject();

    constructor(
        protected parent: ChartComponent
    ) {
        this.parent.update$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(this.updateAxis.bind(this));
    }

    ngOnInit(): void {
        // this.updateAxis();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    protected updateAxis() {
    };

}
