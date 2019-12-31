import { Directive, Host, Input } from '@angular/core';

import * as uuid from 'uuid';

import { BaseAxisDirective } from '../chart-axis/base-axis.directive';
import { ChartComponent } from '../chart.component';

@Directive({
    selector: 'prb-chart-points'
})
export class ChartPointsDirective extends BaseAxisDirective {

    @Input() data: any[];

    private uid: string;

    constructor(
        @Host() parent: ChartComponent
    ) {
        super(parent);
        this.uid = `points${uuid.v4()}`;
    }

    ngOnInit() {
        super.ngOnInit();
    }

    protected updateAxis() {
        super.updateAxis();
        const points = this.chart.selectAll(`circle.circle.${this.uid}`)
            .data(this.data);
        
        points.join(
            enter => enter
                .append('circle')
                .attr('class', `circle ${this.uid}`)
                .attr('r', 5)
                .style('fill', '#37ff5f')
                .style('stroke', '#62a6eb')
                .style('stroke-width', 1)
                .attr('cx', (d, i) => this.xScaleD3(i))
                .attr('cy', (d: any) => this.yScaleD3(d)),
            update => update
                .transition()
                .duration(500)
                .attr('cx', (d, i) => this.xScaleD3(i))
                .attr('cy', (d: any) => this.yScaleD3(d)) as any
        );
    }
}
