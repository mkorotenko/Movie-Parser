import { Host, Directive } from '@angular/core';

import * as d3 from 'd3';

import { ChartComponent } from '../chart.component';
import { BaseAxisDirective } from './base-axis.directive';

@Directive({
    selector: 'prb-left-axis'
})
export class LeftAxisDirective extends BaseAxisDirective {

    constructor(
        @Host() parent: ChartComponent
    ) {
        super(parent);
    }

    ngOnInit() {
        super.ngOnInit();
        this.chart.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(this.yScaleD3));
    }

    protected updateAxis() {
        super.updateAxis();
        this.chart.selectAll('g.y.axis')
            .call(d3.axisLeft(this.yScaleD3));
    }

}
