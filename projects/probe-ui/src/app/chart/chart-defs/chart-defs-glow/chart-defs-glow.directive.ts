import { Directive, Host, Input } from '@angular/core';
import * as d3 from 'd3';

import { ChartComponent } from '../../chart.component';

@Directive({
    selector: 'prb-chart-glow'
})
export class ChartDefsGlowDirective {

    @Input() id: string;

    @Input() deviation = '3.5';

    private get chart(): d3.Selection<SVGElement, unknown, null, unknown> {
        return this.parent.chart;
    }

    constructor(
        @Host() private parent: ChartComponent
    ) { }

    ngOnInit(): void {
        const filter = this.chart.append('filter').attr('id', this.id);
        filter.append('feGaussianBlur')
            .attr('stdDeviation', this.deviation)
            .attr('result', 'coloredBlur');

        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic'); 
    }
}
