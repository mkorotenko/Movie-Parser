import { Directive, Input, Host, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ChartComponent } from '../../chart.component';

@Directive({
    selector: 'prb-chart-gradient'
})
export class ChartDefsGradientDirective implements OnInit {

    @Input() id: string;

    maxValue = 30;

    colorRange = [
        {
            color: '#ce6c44',
            value: 30
        },
        {
            color: '#c29b3f',
            value: 21
        },
        {
            color: '#4bc260',
            value: 10.5
        },
        {
            color: '#65d1b4',
            value: 4.5
        },
        {
            color: '#074bed',
            value: 0
        },
    ]

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
            .attr("gradientUnits", "userSpaceOnUse")
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 100);

        this.colorRange.forEach(cr => {
            linearGradient.append('stop')
                .attr('offset', `${((this.maxValue - cr.value)/this.maxValue)*100}%`)
                .attr('stop-color', cr.color);
        })

    }
}
