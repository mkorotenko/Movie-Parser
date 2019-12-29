import { Directive, Input, Host, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ChartComponent } from '../../chart.component';

@Directive({
    selector: 'prb-chart-gradient'
})
export class ChartDefsGradientDirective implements OnInit {

    @Input() id: string;

    private get chart(): d3.Selection<SVGElement, unknown, null, unknown> {
        return this.parent.chart;
    }

    constructor(
        @Host() private parent: ChartComponent
    ) { }

    ngOnInit(): void {

        const linearGradient = this.chart.append("defs")
            .append("linearGradient")
            .attr("id", this.id)
            .attr("gradientTransform", "rotate(90)");

        const colorRange = ['#ce6c44', '#c29b3f', '#4bc260', '#65d1b4', '#074bed']
        const color = d3.scaleLinear().range(colorRange as any).domain([1, 2, 3, 4, 5]);

        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", color(1));

        linearGradient.append("stop")
            .attr("offset", "25%")
            .attr("stop-color", color(2));

        linearGradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", color(3));

        linearGradient.append("stop")
            .attr("offset", "75%")
            .attr("stop-color", color(4));

        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", color(5));
    }
}
