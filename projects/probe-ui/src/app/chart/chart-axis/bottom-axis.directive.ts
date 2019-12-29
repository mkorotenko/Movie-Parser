import { Host, Directive } from '@angular/core';

import * as d3 from 'd3';

import { ChartComponent } from '../chart.component';
import { BaseAxisDirective } from './base-axis.directive';

@Directive({
    selector: 'prb-bottom-axis'
})
export class BottomAxisDirective extends BaseAxisDirective {

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
            .call(d3.axisBottom(this.xScaleD3));
    }

    protected updateAxis() {
        super.updateAxis();
        this.chart.selectAll('g.x.axis')
            .attr('transform', `translate(0,${this.height})`)
            .call(d3.axisBottom(this.xScaleD3));
    }

}
