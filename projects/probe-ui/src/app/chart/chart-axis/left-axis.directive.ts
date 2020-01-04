import { Host, Directive } from '@angular/core';

import * as d3 from 'd3';

import { BaseAxisDirective } from './base-axis.directive';
import { ChartComponent } from '../chart.component';
import { ChartScaleXServiceService } from '../chart-scale-x-service.service';
import { ChartScaleYServiceService } from '../chart-scale-y-service.service';

@Directive({
    selector: 'prb-left-axis'
})
export class LeftAxisDirective extends BaseAxisDirective {

    constructor(
        @Host() parent: ChartComponent,
        scaleXService: ChartScaleXServiceService,
        scaleYService: ChartScaleYServiceService
    ) {
        super(parent, scaleXService, scaleYService);
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
