import {
    Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges,
    OnChanges, ChangeDetectionStrategy, HostListener, EventEmitter, ChangeDetectorRef, Output
} from '@angular/core';
import * as d3 from 'd3';

import { merge, Subject } from 'rxjs';
import { debounceTime, tap, shareReplay, delay, filter, distinctUntilChanged } from 'rxjs/operators';

const MARGIN = { top: 20, right: 30, bottom: 30, left: 30 };

export interface ChartData {
    x: number | Date;
    y: number;
}

@Component({
    selector: 'prb-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges {

    public chart: d3.Selection<SVGElement, unknown, null, unknown>;

    @ViewChild('chart', { static: true })
    set chartEl(value: ElementRef) {
        this.chart = d3.select(value.nativeElement);
    }

    @Input() xScale: number = 1;

    @Input() xTimeStart: Date;

    @Input() xTimeEnd: Date;

    @Input() yScale: number = 1;

    @Input() marginTop: number = MARGIN.top;

    @Input() marginBottom: number = MARGIN.bottom;

    @Input() marginLeft: number = MARGIN.left;

    @Input() marginRight: number = MARGIN.right;

    private resize$ = new Subject();
    private updateScale$ = new Subject();

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

    public xScaleD3: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number>;

    public yScaleD3: d3.ScaleLinear<number, number>;

    public chartTransform = `translate(${MARGIN.left},${MARGIN.top})`

    private onMouseX$ = new EventEmitter<number>();

    private onMouseY$ = new EventEmitter<number>();

    @Output() mouseX = this.onMouseX$.pipe(distinctUntilChanged());

    @Output() mouseY = this.onMouseY$.pipe(distinctUntilChanged());

    constructor(
        private el: ElementRef,
        private cd: ChangeDetectorRef
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
        this.xScaleD3 = d3.scaleUtc()//d3.scaleLinear()
            .domain([this.xTimeStart, this.xTimeEnd])
            .range([0, this.width]);
    }

    private updateYScale() {
        this.yScaleD3 = d3.scaleLinear()
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

    private getData(probe: any) {
        const Temp: any[] = [];
        const Hum: any[] = [];

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < probe.length; i++) {
            const date = new Date(probe[i].date.replace('.000Z', '+0300'));
            Temp.push({ x: date, y: probe[i].temp });
            Hum.push({ x: date, y: probe[i].hum });
        }
        return [
            {
                values: Hum,
                key: 'Hum %',
                color: '#2ca02c'
            },
            {
                values: Temp,
                key: 'Temp C',
                color: '#ff7f0e'
            }
        ];
    }

}

        //SECOND
        // svg
        //   .attr("width", width)
        //   .attr("height", height)
        // .append("g")
        //   .attr("transform",
        //         "translate(" + margin.left + "," + margin.top + ")");

        //     // Add X axis --> it is a date format
        // var x = d3.scaleTime()
        //     .domain(d3.extent(data, function(d) { return d.date; }))
        //     .range([ 0, width ]);
        //   const xAxis = svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));

        //   // Add Y axis
        //   var y = d3.scaleLinear()
        //     .domain([0, d3.max(data, function(d) { return +d.value; })])
        //     .range([ height, 0 ]);
        //   const yAxis = svg.append("g")
        //     .call(d3.axisLeft(y));

        //   // Add a clipPath: everything out of this area won't be drawn.
        //   var clip = svg.append("defs").append("svg:clipPath")
        //       .attr("id", "clip")
        //       .append("svg:rect")
        //       .attr("width", width )
        //       .attr("height", height )
        //       .attr("x", 0)
        //       .attr("y", 0);

        //   // Add brushing
        //   var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        //       .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        //       .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

        //   // Create the line variable: where both the line and the brush take place
        //   var line = svg.append('g')
        //     .attr("clip-path", "url(#clip)")

        //   // Add the line
        //   line.append("path")
        //     .datum(data)
        //     .attr("class", "line")  // I add the class line to be able to modify this line later on.
        //     .attr("fill", "none")
        //     .attr("stroke", "steelblue")
        //     .attr("stroke-width", 1.5)
        //     .attr("d", d3.line()
        //       .x(function(d) { return x(d.date) })
        //       .y(function(d) { return y(d.value) })
        //       )

        //   // Add the brushing
        //   line
        //     .append("g")
        //       .attr("class", "brush")
        //       .call(brush);

        //       // A function that set idleTimeOut to null
        // var idleTimeout
        // function idled() { idleTimeout = null; }
        //           // A function that update the chart for given boundaries
        // function updateChart() {

        //   // What are the selected boundaries?
        //   const extent = d3.event.selection

        //   // If no selection, back to initial coordinate. Otherwise, update X axis domain
        //   if(!extent){
        //     if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        //     x.domain([ 4,8])
        //   }else{
        //     x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        //     line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        //   }

        //   // Update axis and line position
        //   xAxis.transition().duration(1000).call(d3.axisBottom(x))
        //   line
        //       .select('.line')
        //       .transition()
        //       .duration(1000)
        //       .attr("d", d3.line()
        //         .x(function(d) { return x(d.date) })
        //         .y(function(d) { return y(d.value) })
        //       )
        // }

        //     // If user double click, reinitialize the chart
        //     svg.on("dblclick",function(){
        //       x.domain(d3.extent(data, function(d) { return d.date; }))
        //       xAxis.transition().call(d3.axisBottom(x))
        //       line
        //         .select('.line')
        //         .transition()
        //         .attr("d", d3.line()
        //           .x(function(d) { return x(d.date) })
        //           .y(function(d) { return y(d.value) })
        //       )
        //     });


        //FIRST
        // const x = d3.scaleUtc()
        //   .domain(d3.extent(data, (d: any) => new Date(d.date)))
        //   .range([margin.left, width - margin.right]);

        // const y = d3.scaleLinear()
        //   .domain(d3.extent(data, (d: any) => +d.value)).nice()
        //   .range([height - margin.bottom, margin.top]);

        // const color = d3.scaleOrdinal(
        //   data.conditions, 
        //   data.colors
        // ).unknown("white");

        // const xAxis = g => g
        //   .attr("transform", `translate(0,${height - margin.bottom})`)
        //   .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        //   .call(g => g.select(".domain").remove());

        // const yAxis = g => g
        //   .attr("transform", `translate(${margin.left},0)`)
        //   .call(d3.axisLeft(y))
        //   .call(g => g.select(".domain").remove())
        //   .call(g => g.select(".tick:last-of-type text").append("tspan").text(data.y));

        // const line = d3.line()
        //   .curve(d3.curveStep)
        //   .defined((d: any) => !isNaN(d.value))
        //   .x((d: any) => x(d.date))
        //   .y((d: any) => y(d.value));

        // svg.attr("viewBox", [0, 0, width, height] as any);

        // svg.append("g")
        //   .call(xAxis);

        // svg.append("g")
        //   .call(yAxis);

        // function ff(v: number) {
        //   if (v < 0.2)
        //     return color('CLR');
        //   if (v < 0.4)
        //     return color('FEW');
        //   if (v < 0.6)
        //     return color('SCT');
        //   if (v < 0.8)
        //     return color('BKN');
        //   return 'OVC';
        // }
        // svg.append("linearGradient")
        //     .attr("id", 'gradient1')
        //     .attr("gradientUnits", "userSpaceOnUse")
        //     .attr("x1", 0)
        //     .attr("y1", height - margin.bottom)
        //     .attr("x2", 0)
        //     .attr("y2", margin.top)
        //   .selectAll("stop")
        //     .data(d3.ticks(0, 1, 10))
        //   .join("stop")
        //     .attr("offset", d => d)
        //     .attr("stop-color", d => ff(d));

        // svg.append("path")
        //   .datum(data)
        //   .attr("fill", "url(#gradient1)")
        //   .attr("stroke-width", 1.5)
        //   .attr("stroke-linejoin", "round")
        //   .attr("stroke-linecap", "round")
        //   .attr("d", line);

        // this.chart = svg.node().outerHTML;
