import { Host, Directive } from '@angular/core';

import * as d3 from 'd3';

import { BaseAxisDirective } from './base-axis.directive';

import { ChartComponent } from '../chart.component';
import { ChartScaleXServiceService } from '../chart-scale-x-service.service';
import { ChartScaleYServiceService } from '../chart-scale-y-service.service';

@Directive({
    selector: 'ui-bottom-axis'
})
export class BottomAxisDirective extends BaseAxisDirective {

    constructor(
        @Host() parent: ChartComponent,
        scaleXService: ChartScaleXServiceService,
        scaleYService: ChartScaleYServiceService
    ) {
        super(parent, scaleXService, scaleYService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.chart.append('g').attr('class', 'x axis');
    }

    protected updateAxis() {
        super.updateAxis();
        this.chart.selectAll('g.x.axis')
            .attr('transform', `translate(0,${this.height})`)
            .call(d3.axisBottom(this.xScaleD3));
    }

}
