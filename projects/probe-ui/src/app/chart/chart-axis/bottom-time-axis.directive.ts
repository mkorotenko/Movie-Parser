import { Host, Directive } from '@angular/core';

import * as d3 from 'd3';

import { ChartComponent } from '../chart.component';
import { BaseAxisDirective } from './base-axis.directive';
import { takeUntil } from 'rxjs/operators';

const timeFormat = "%H:%M";

@Directive({
    selector: 'prb-bottom-time-axis'
})
export class BottomTimeAxisDirective extends BaseAxisDirective {

    constructor(
        @Host() parent: ChartComponent
    ) {
        super(parent);
    }

    ngOnInit() {
        super.ngOnInit();
        this.chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${this.height})`)
            .call(d3.axisBottom(this.xScaleD3).tickFormat(d3.timeFormat(timeFormat)));

        this.parent.updateXAxis$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(this.updateAxis.bind(this));
    }

    protected updateAxis() {
        super.updateAxis();
        this.chart.selectAll('g.x.axis')
            .attr('transform', `translate(0,${this.height})`)
            .call(d3.axisBottom(this.xScaleD3).tickFormat(d3.timeFormat(timeFormat)));
    }

}
