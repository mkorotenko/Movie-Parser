import {
    Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges,
    OnChanges, ChangeDetectionStrategy, HostListener, EventEmitter
} from '@angular/core';
import * as d3 from 'd3';
import { debounceTime } from 'rxjs/operators';

const CURVES = [
    'curveLinear',
    'curveBasis',
    'curveBundle',
    'curveCardinal',
    'curveCatmullRom',
    'curveMonotoneX',
    'curveMonotoneY',
    'curveNatural',
    'curveStep',
    'curveStepAfter',
    'curveStepBefore',
    'curveBasisClosed'
];

const glowDeviation = '3.5';
const MARGIN = { top: 20, right: 30, bottom: 30, left: 30 };

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges {

    private svg: d3.Selection<any, unknown, null, unknown>;

    @ViewChild('chart', { static: true })
    set chartEl(value: ElementRef) {
        this.svg = d3.select(value.nativeElement);
    }

    @Input() data: any[];

    private resize$ = new EventEmitter();

    private updateSize$ = this.resize$.pipe(
        debounceTime(100)
    )

    ngOnInit() {

        const cWidth = 690, cHeight = 300;
        const width = cWidth - MARGIN.left - MARGIN.right,
            height = cHeight - MARGIN.top - MARGIN.bottom;

        const maxY = 100
        let data = Array(11).fill(undefined).map(() => d3.randomUniform(maxY)())

        const pathContainer = this.svg
            .attr("viewBox", [0, 0, cWidth, cHeight] as any)
            .append('g')
            .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

        this.glowEffect(pathContainer, 'glow');

        // const colorScale = d3.scale.linear()
        // .range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c",
        //         "#f9d057","#f29e2e","#e76818","#d7191c"]);

        const linearGradient = pathContainer.append("defs")
            .append("linearGradient")
            .attr("id", "linear-gradient")
            .attr("gradientTransform", "rotate(90)");
               
            var colorRange = ['#C0D9CC', '#F6F6F4', '#925D60', '#B74F55', '#969943']
            var color = d3.scaleLinear().range(colorRange as any).domain([1, 2, 3, 4, 5]);
        
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
        /*
         * X and Y scales.
         */
        const xScale = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([0, width])

        const yScale = d3.scaleLinear()
            .domain([0, data.reduce((res, value) => Math.max(res, value), 0)])
            .range([height, 0])

        const line = d3.line()
            .x((d, i) => xScale(i))
            .y((d: any) => yScale(d))
            .curve(d3[CURVES[3]])

        /*
         * X and Y axis
         */
        pathContainer.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        pathContainer.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(yScale));

        /*
         * Appending the line to the SVG.
         */
        pathContainer.append('path')
            .datum(data)
            .attr('class', 'data-line glowed')
            .style('stroke-width', 2)
            .style('fill', 'none')
            .style('stroke', 'url(#linear-gradient)')
            .attr('d', line as any)

        /*
         * Add little circles at data points.
         */
        // pathContainer.selectAll('circle')
        //     .data(data)
        //     .enter()
        //     .append('circle')
        //     .attr('class', 'circle')
        //     .attr('cx', (d, i) => xScale(i))
        //     .attr('cy', (d: any) => yScale(d))
        //     .attr('r', 4)
        //     .style('fill', '#D073BA')
        //     .style('stroke', '#11141C')
        //     .style('stroke-width', 2);

        // Add the glow!!
        this.addGlow();

        //FORTH
        // // The number of datapoints
        // var n = 21;

        // // 5. X scale will use the index of our data
        // var xScale = d3.scaleLinear()
        //     .domain([0, n-1]) // input
        //     .range([0, width]); // output

        // // 6. Y scale will use the randomly generate number 
        // var yScale = d3.scaleLinear()
        //     .domain([0, 1]) // input 
        //     .range([height, 0]); // output 

        // // 7. d3's line generator
        // var line = d3.line()
        //     .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        //     .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
        //     .curve(d3.curveMonotoneX) // apply smoothing to the line

        // // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
        // var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })

        // // 1. Add the SVG to the page and employ #2
        // svg
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //   .append("g")
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // // 3. Call the x axis in a group tag
        // svg.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

        // // 4. Call the y axis in a group tag
        // svg.append("g")
        //     .attr("class", "y axis")
        //     .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

        // // 9. Append the path, bind the data, and call the line generator 
        // svg.append("path")
        //     .datum(dataset) // 10. Binds data to the line 
        //     .attr("class", "line") // Assign a class for styling 
        //     .attr("d", line); // 11. Calls the line generator 

        // // 12. Appends a circle for each datapoint 
        // svg.selectAll(".dot")
        //     .data(dataset)
        //   .enter().append("circle") // Uses the enter().append() method
        //     .attr("class", "dot") // Assign a class for styling
        //     .attr("cx", function(d, i) { return xScale(i) })
        //     .attr("cy", function(d) { return yScale(d.y) })
        //     .attr("r", 5)
        //       .on("mouseover", function(a, b, c) { 
        //   			console.log(a) 
        //         this.attr('class', 'focus')
        //     })

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

    }

    ngOnChanges(changes: SimpleChanges) {
        // if (changes.data && this.chart) {
        //   const chartEl = this.chartEl.nativeElement;
        //   const chartData = d3.select(chartEl)
        //     .datum(this.getData(this.data));
        //   chartData.transition().duration(500)
        //     .call(this.chart);
        // }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.resize$.next();
    }

    private glowEffect(pathContainer: any, id: string): void {
        /*
         * Glow effects (Optional)
         */
        const defs = pathContainer.append('defs');

        // Filter for the outside glow
        const filter = defs.append('filter').attr('id', id);
        filter.append('feGaussianBlur')
            .attr('stdDeviation', glowDeviation)
            .attr('result', 'coloredBlur');

        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic'); 
    }

    private addGlow(): void {
        d3.selectAll('.glowed').style('filter', 'url(#glow)');
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
