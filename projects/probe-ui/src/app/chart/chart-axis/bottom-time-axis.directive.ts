import { Host, Directive } from '@angular/core';

import * as d3 from 'd3';

import { takeUntil } from 'rxjs/operators';

import { BaseAxisDirective } from './base-axis.directive';
import { ChartComponent } from '../chart.component';
import { ChartScaleXServiceService } from '../chart-scale-x-service.service';
import { ChartScaleYServiceService } from '../chart-scale-y-service.service';

const timeFormat = "%H:%M";

@Directive({
    selector: 'prb-bottom-time-axis'
})
export class BottomTimeAxisDirective extends BaseAxisDirective {

    constructor(
        @Host() parent: ChartComponent,
        scaleXService: ChartScaleXServiceService,
        scaleYService: ChartScaleYServiceService,
    ) {
        super(parent, scaleXService, scaleYService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.chart.append('g').attr('class', 'x axis')

        this.parent.updateXAxis$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(this.updateAxis.bind(this));
    }

    protected updateAxis() {
        super.updateAxis();
        this.chart.selectAll('g.x.axis')
            .attr('transform', `translate(0,${this.height})`)
            .call(
                d3.axisBottom(this.xScaleD3)
                    .ticks(this.getTicks(this.width))
                    .tickFormat(d3.timeFormat(timeFormat))
            );
    }

    private getTicks(width: number): d3.TimeInterval | number {
        if (width < 400) {
            return 5
        } else if (width < 500) {
            return 10
        } else if (width < 800) {
            return d3.timeMinute.every(60);
        } else {
            return d3.timeMinute.every(30);
        }
    }

}
