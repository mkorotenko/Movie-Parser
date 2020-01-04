import { Host, Directive } from '@angular/core';

import * as d3 from 'd3';

import { BaseAxisDirective } from './base-axis.directive';
import { ChartComponent } from '../chart.component';
import { ChartScaleXServiceService } from '../chart-scale-x-service.service';
import { ChartScaleYServiceService } from '../chart-scale-y-service.service';

@Directive({
    selector: 'prb-right-axis'
})
export class RightAxisDirective extends BaseAxisDirective {

    constructor(
        @Host() parent: ChartComponent,
        scaleXService: ChartScaleXServiceService,
        scaleYService: ChartScaleYServiceService
    ) {
        super(parent, scaleXService, scaleYService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.chart.append('g').attr('class', 'ry axis');
    }

    protected updateAxis() {
        super.updateAxis();
        this.chart.selectAll('g.ry.axis')
            .attr('transform', `translate(${this.width}, 0)`)
            .call(d3.axisRight(this.yScaleD3));
    }

}
