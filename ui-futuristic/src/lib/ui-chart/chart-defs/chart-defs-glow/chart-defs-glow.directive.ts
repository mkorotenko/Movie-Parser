import { Directive, Host, Input } from '@angular/core';
import * as d3 from 'd3';

import { ChartComponent } from '../../chart.component';

@Directive({
    selector: 'ui-chart-glow'
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
        const defs = this.chart.append('defs');
        const filter = defs.append('filter').attr('id', this.id);
        filter.append('feGaussianBlur')
            .attr('stdDeviation', this.deviation)
            .attr('result', 'coloredBlur');

        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
        // const filter = defs.append('filter')
        //     .attr('id', this.id)
        //     .attr('x', -5)
        //     .attr('y', -4.5)
        //     .attr('height', 10)
        //     .attr('width', 150);

        // filter.append('feOffset')
        //     .attr('in', 'SourceGraphic')
        //     .attr('dx', 0)
        //     .attr('dy', 0)
        //     .attr('result', 'offset2')

        // filter.append('feGaussianBlur')
        //     .attr('in', 'offset2')
        //     .attr('stdDeviation', this.deviation)
        //     .attr('result', 'coloredBlur');
            
        // const feMerge = filter.append('feMerge');
        // feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        // feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }
}
