import { Directive, Host, Input } from '@angular/core';

import * as uuid from 'uuid';
import * as d3 from 'd3';

import { BaseAxisDirective } from '../chart-axis/base-axis.directive';
import { ChartComponent } from '../chart.component';

const CURVES = [
    'curveLinear',
    'curveBasis',
    'curveBundle',
    'curveCardinal',
    'curveCatmullRom',
    'curveMonotoneX',
    'curveMonotoneY',
    'curveNatural',
    'curveStep',
    'curveStepAfter',
    'curveStepBefore',
    'curveBasisClosed'
];

@Directive({
    selector: 'prb-chart-line'
})

export class ChartLineDirective extends BaseAxisDirective {

    @Input() data: any[];

    @Input() stroke: string;

    @Input() filter: string;

    private uid: string;

    constructor(
        @Host() parent: ChartComponent
    ) {
        super(parent);
        this.uid = `line${uuid.v4()}`;
    }

    ngOnInit() {
        super.ngOnInit();
        const path = this.chart.append('path')
            .attr('class', `data-line glowed ${this.uid}`)
            .style('stroke-width', 2)
            .style('fill', 'none');
        if (this.stroke) {
            path.style('stroke', this.stroke);
        }
        if (this.filter) {
            path.style('filter', this.filter);
        }
    }

    protected updateAxis() {
        super.updateAxis();
        const line: any = d3.line()
            .x((d, i) => this.xScaleD3(i))
            .y((d: any) => this.yScaleD3(d))
            .curve(d3[CURVES[3]]);

        const chart = this.chart.selectAll(`path.${this.uid}`)
            .datum(this.data);

        chart.join(
            enter => enter
                .attr('d', line),
            update => update
                .transition()
                .duration(500)
                .attr('d', line) as any
        );
    }

}