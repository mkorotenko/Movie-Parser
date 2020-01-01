import { Directive, Host, SimpleChanges, Input, OnInit } from '@angular/core';

import { Subject, combineLatest } from 'rxjs';
import { takeUntil, map, tap, shareReplay } from 'rxjs/operators';

import * as uuid from 'uuid';

import { ChartLineDirective } from '../chart-line/chart-line.directive';
import { ChartComponent, ChartData } from '../chart.component';

function findNearest(data: Array<number>, value: number) {
    const aLength: number = data.length;
    let ind: number = 0;
    let step: number = Math.min(aLength >> 1, aLength - 1);
    let cDir: boolean;
    while (step > 1) {
        if (cDir) {
            ind = ind - step;
        } else {
            ind = ind + step;
        }
        if (data[ind] === value) {
            return ind;
        }
        cDir = data[ind] > value;
        step = Math.round(step/2);
    }
    const prevInd = ind;
    let nextInd;
    if (cDir) {
        ind = Math.max(ind - 1, 0);
        nextInd = Math.max(ind - 1);
    } else {
        ind = Math.min(ind + 1, aLength - 1);
        nextInd = Math.min(ind + 1, aLength - 1);
    }
    const cV = Math.abs(data[ind] - value),
        pV = Math.abs(data[prevInd] - value),
        nV = Math.abs(data[nextInd] - value);
    if (pV < nV) {
        if (pV < cV) {
            return prevInd;
        }
    } else {
        if (nV < cV) {
            return nextInd;
        }
    }
    return ind;
}

@Directive({
    selector: '[prbChartHint]'
})
export class ChartHintDirective implements OnInit {

    @Input() data: Array<ChartData>;

    @Input() minDist: number = 10;

    private scaled: Array<any>;

    private uid: string;

    get parent(): ChartComponent {
        return this.chart.parent;
    }

    get xScale(): d3.ScaleLinear<number, number> | d3.ScaleTime<number, number> {
        return this.parent.xScaleD3;
    }
    
    get yScale(): d3.ScaleLinear<number, number> {
        return this.parent.yScaleD3;
    }

    get pChart(): d3.Selection<SVGElement, unknown, null, unknown> {
        return this.parent.chart;
    }

    private unsubscribe$ = new Subject<void>();

    constructor(
        @Host() private chart: ChartLineDirective
    ) {
        this.uid = `hint${uuid.v4()}`;
    }

    ngOnInit(): void {
        combineLatest(
            this.parent.mouseX,
            this.parent.update$.pipe(
                tap(() => this.calculateScale()),
                shareReplay()
            )
        ).pipe(
            map(([mouseX, update]) => mouseX),
            takeUntil(this.unsubscribe$)
        ).subscribe(this.drawMouseLine.bind(this));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            this.calculateScale();
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private calculateScale() {
        const xScale = this.xScale;
        this.scaled = (this.data || []).map((d, i) => xScale(d.x));
    }

    private drawMouseLine(mouseX: number) {
        const parent = this.parent;
        const pChart = this.pChart;
        if (mouseX === null || mouseX - parent.marginLeft <= 0 || (mouseX - parent.marginRight - 1) >= parent.width) {
            pChart.selectAll(`line.mouse-pos`).remove();
            this.removePoint();
            return;
        }

        const chart = pChart.selectAll(`line.mouse-pos`)
            .data([mouseX]);

        chart.join(
            enter => enter
                .append('line')
                .attr("class", "mouse-pos")
                .attr('transform', `translate(${-parent.marginLeft},0)`)
                .attr("x1", (d, i) => d)
                .attr("y1", parent.height)
                .attr("x2", (d, i) => d)
                .attr("y2", 0),
            update => update
                .attr("x1", (d, i) => d)
                .attr("x2", (d, i) => d) as any
        );

        const xPos = mouseX - parent.marginLeft;
        const nIndex = findNearest(this.scaled, xPos);
        const dist = Math.abs(this.scaled[nIndex] - xPos);
        if (dist < this.minDist) {
            this.drawPoint(this.data[nIndex].x, this.data[nIndex].y);
        } else {
            this.removePoint();
        }
    }

    private pointExists = false;

    private drawPoint(xPos?: number | Date, yPos?: number) {

        if (this.pointExists) {
            return;
        }

        const data = [xPos];

        const points = this.pChart.selectAll(`circle.hint.${this.uid}`)
            .data(data);

        const t = this.pChart.transition()
            .duration(300);

        points.join(
            enter => enter
                .append('circle')
                .attr('class', `hint ${this.uid}`)
                .attr('r', 5)
                .attr('cx', (d, i) => this.xScale(xPos))
                .attr('cy', (d: any) => this.yScale(yPos))
                .style('opacity', 0)
                .call(enter => enter.transition(t).style('opacity', 1)),
        );
        this.pointExists = true;
    }

    private removePoint() {
        if (!this.pointExists) {
            return;
        }

        const data = [];

        const points = this.pChart.selectAll(`circle.hint.${this.uid}`)
            .data(data);

        const t = this.pChart.transition()
            .delay(300)
            .duration(300);

        points.join(
            exit => exit
                .style('opacity', 1)
                .call(exit => exit.transition(t).style('opacity', 0))
                .remove()
        );
        this.pointExists = false;

    }

}
