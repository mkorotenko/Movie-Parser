import { Directive, Input, Host, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { ChartData, ChartComponent } from '../chart.component';

interface LoadingError {
    status: number;
    statusText: string;
    url: string;
    ok: boolean;
    name: string;
    message: string;
    error: string;
}

@Directive({
    selector: 'ui-chart-loader, [uiChartLoader]'
})
export class ChartLoaderDirective implements OnChanges, OnDestroy {

    @Input() data: Array<ChartData>;

    @Input() loadError: LoadingError;

    private loaderExists = false;

    constructor(
        @Host() public parent: ChartComponent
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            if (changes.data.firstChange && !changes.data.currentValue) {
                this.drawLoader();
            }
            if (this.loaderExists && changes.data.currentValue) {
                this.removeLoader();
            }
    
        }
        if (changes.loadError && this.loadError) {
            this.removeLoader();
            this.drawError(this.loadError.statusText);
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

    private drawError(message: string): void {
        const parent = this.parent;
        parent.chart.append('text')
            .attr('class', 'data-loader error')
            .attr('x', parent.width / 2)
            .attr('y', parent.height / 2)
            .attr('font-family', 'inherit')
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'red')
            .text(message);
        this.loaderExists = true;
    }

    private removeLoader(): void {
        if (this.loaderExists) {
            this.parent.chart.selectAll('text.data-loader').remove();
        }
        this.loaderExists = false;
    }

}
