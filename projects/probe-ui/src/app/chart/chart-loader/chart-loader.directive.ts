import { Directive, Input, Host, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { ChartData, ChartComponent } from '../chart.component';

@Directive({
    selector: 'prb-chart-loader, [prbChartLoader]'
})
export class ChartLoaderDirective implements OnChanges, OnDestroy {

    @Input() data: Array<ChartData>;

    private loaderExists = false;

    constructor(
        @Host() public parent: ChartComponent
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.data) {
            return;
        }
        if (changes.data.firstChange && !changes.data.currentValue) {
            this.drawLoader();
        }
        if (this.loaderExists && changes.data.currentValue) {
            this.removeLoader();
        }
    }

    ngOnDestroy(): void {
        this.removeLoader();
    }

    private drawLoader(): void {
        const parent = this.parent;
        parent.chart.append('text')
            .attr('class', 'data-loader')
            .attr('x', parent.width / 2)
            .attr('y', parent.height / 2)
            .attr('font-family', 'inherit')
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'currentColor')
            .text('Data loading...');
        this.loaderExists = true;
    }

    private removeLoader(): void {
        if (this.loaderExists) {
            this.parent.chart.selectAll('text.data-loader').remove();
        }
        this.loaderExists = false;
    }

}
