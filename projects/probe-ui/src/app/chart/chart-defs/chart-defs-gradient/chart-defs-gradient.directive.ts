import { Directive, Input, Host, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ChartComponent } from '../../chart.component';

@Directive({
    selector: 'prb-chart-gradient'
})
export class ChartDefsGradientDirective implements OnInit {

    @Input() id: string;

    @Input() colorRange: any;

    private get chart(): d3.Selection<SVGElement, unknown, null, unknown> {
        return this.parent.chart;
    }

    private get height(): number {
        return this.parent.height;
    }

    constructor(
        @Host() private parent: ChartComponent
    ) { }

    ngOnInit(): void {

        const linearGradient = this.chart.append("defs")
            .append("linearGradient")
            .attr("id", this.id)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', this.height);

        this.colorRange.forEach(cr => {
            linearGradient.append('stop')
                .attr('offset', `${cr.value}%`)
                .attr('stop-color', cr.color);
        })

    }
}
