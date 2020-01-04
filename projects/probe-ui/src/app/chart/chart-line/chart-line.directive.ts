import { Directive, Host, Input, SimpleChanges } from '@angular/core';

import * as uuid from 'uuid';
import * as d3 from 'd3';

import { BaseAxisDirective } from '../chart-axis/base-axis.directive';
import { ChartComponent, ChartData } from '../chart.component';
import { ChartScaleXServiceService } from '../chart-scale-x-service.service';
import { ChartScaleYServiceService } from '../chart-scale-y-service.service';

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

function isData(array: Array<ChartData>): boolean {
    if (!array) {
        return false;
    }
    if (!array.length) {
        return false;
    }
    return true;
}

@Directive({
    selector: 'prb-chart-line'
})

export class ChartLineDirective extends BaseAxisDirective {

    @Input() data: Array<ChartData>;

    @Input() stroke: string;

    @Input() filter: string;

    private uid: string;

    constructor(
        @Host() parent: ChartComponent,
        scaleXService: ChartScaleXServiceService,
        scaleYService: ChartScaleYServiceService
    ) {
        super(parent, scaleXService, scaleYService);
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

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            if (isData(this.data) && !isData(changes.data.previousValue)) {
                const data = this.data;
                this.data = data.map(d => ({
                    x: d.x,
                    y: 0
                }))
                this.updateAxis();
                setTimeout(() => {
                    this.data = data;
                    this.updateAxis();
                }, 0);
            } else {
                this.updateAxis();
            }
        }
    }

    protected updateAxis() {
        super.updateAxis();
        const line: any = d3.line()
            .x((date: any) => this.xScaleD3(date.x))
            .y((date: any) => this.yScaleD3(date.y))
            .curve(d3[CURVES[5]]);

        const chart = this.chart.selectAll(`path.${this.uid}`)
            .datum((this.data || []) as any);

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