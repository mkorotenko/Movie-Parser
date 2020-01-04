import {
    Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges,
    OnChanges, ChangeDetectionStrategy, HostListener, EventEmitter, ChangeDetectorRef, Output
} from '@angular/core';
import * as d3 from 'd3';

import { merge, Subject } from 'rxjs';
import { debounceTime, tap, shareReplay, delay, filter, distinctUntilChanged } from 'rxjs/operators';
import { ChartScaleXServiceService } from './chart-scale-x-service.service';
import { ChartScaleYServiceService } from './chart-scale-y-service.service';

const MARGIN = { top: 20, right: 30, bottom: 30, left: 30 };

export interface ChartData {
    x: number | Date;
    y: number;
}

@Component({
    selector: 'prb-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ChartScaleXServiceService,
        ChartScaleYServiceService
    ]
})
export class ChartComponent implements OnInit, OnChanges {

    public chart: d3.Selection<SVGElement, unknown, null, unknown>;

    @ViewChild('chart', { static: true })
    set chartEl(value: ElementRef) {
        this.chart = d3.select(value.nativeElement);
    }

    xScale: number = 1;

    yScale: number = 1;

    @Input() marginTop: number = MARGIN.top;

    @Input() marginBottom: number = MARGIN.bottom;

    @Input() marginLeft: number = MARGIN.left;

    @Input() marginRight: number = MARGIN.right;

    private resize$ = new Subject();

    public updateScale$ = new Subject();

    public update$ = merge(
        this.resize$.pipe(
            debounceTime(100),
            tap(() => {
                const element = this.el.nativeElement;
                this.svgWidth = element.clientWidth;
                this.svgHeight = element.clientHeight;
                this.width = this.svgWidth - this.marginLeft - this.marginRight,
                this.height = this.svgHeight - this.marginTop - this.marginBottom;
                this.cd.markForCheck();
            })
        ),
        this.updateScale$.pipe(
            delay(0)
        )
    ).pipe(
        filter(() => !!this.chart),
        tap(this.updateScale.bind(this)),
        shareReplay(1)
    )

    public updateXAxis$ = new Subject();

    public updateYAxis$ = new Subject();

    public svgWidth: number;

    public svgHeight: number;

    public width: number;

    public height: number;

    public chartTransform = `translate(${MARGIN.left},${MARGIN.top})`

    private onMouseX$ = new EventEmitter<number>();

    private onMouseY$ = new EventEmitter<number>();

    @Output() mouseX = this.onMouseX$.pipe(distinctUntilChanged());

    @Output() mouseY = this.onMouseY$.pipe(distinctUntilChanged());

    constructor(
        private el: ElementRef,
        private cd: ChangeDetectorRef,
        private scaleXService: ChartScaleXServiceService,
        private scaleYService: ChartScaleYServiceService
    ) {}

    ngOnInit() {

        const element = this.el.nativeElement;
        this.svgWidth = element.clientWidth;
        this.svgHeight = element.clientHeight;
        this.width = this.svgWidth - this.marginLeft - this.marginRight,
        this.height = this.svgHeight - this.marginTop - this.marginBottom;

        this.updateScale();

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.xScale || changes.yScale) {
            this.updateScale$.next()
        }
        if (changes.xTimeStart && !changes.xTimeStart.firstChange) {
            this.updateXScale()
            this.updateXAxis$.next();
        }
        if (changes.yTimeStart && !changes.yTimeStart.firstChange) {
            this.updateYScale()
            this.updateYAxis$.next();
        }
    }

    @HostListener('window:resize')
    onResize(): void {
        this.resize$.next();
    }

    private updateScale() {
        this.updateXScale();
        this.updateYScale();
    }

    private updateXScale() {
        this.scaleXService.xScaleD3 = d3.scaleLinear()
            .domain([0, this.xScale])
            .range([this.width, 0]);
    }

    private updateYScale() {
        this.scaleYService.yScaleD3 = d3.scaleLinear()
            .domain([0, this.yScale])
            .range([this.height, 0]);
    }

    onMouseMove(event: MouseEvent): void {
        this.onMouseX$.next(event.offsetX);
        this.onMouseY$.next(event.offsetY);
    }

    onMouseLeave(): void {
        this.onMouseX$.next(null);
        this.onMouseY$.next(null);
    }

}
