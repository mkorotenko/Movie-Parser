import {
  Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges,
  OnChanges, ChangeDetectionStrategy
} from '@angular/core';
import * as nv from 'nvd3';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges {
  @ViewChild('chart', { static: true }) chartEl: ElementRef;

  @Input() data: any[];

  private chart: any;

  ngOnInit() {

    // tslint:disable-next-line:no-string-literal
    const formatter = (d) => d3['time'].format('%H:%M')(new Date(d));

    nv.addGraph(() => {
      this.chart = nv.models.lineChart()
        .useInteractiveGuideline(true);

      this.chart.xAxis
        .axisLabel('Time')
        .tickFormat(formatter);

      this.chart.yAxis
        .axisLabel('Values')
        .tickFormat(d3.format('.01f'));

      nv.utils.windowResize(this.chart.update);
      return this.chart;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && this.chart) {
      const chartEl = this.chartEl.nativeElement;
      const chartData = d3.select(chartEl)
        .datum(this.getData(this.data));
      chartData.transition().duration(500)
        .call(this.chart);
    }
  }

  private getData(probe: any) {
    const Temp: any[] = [];
    const Hum: any[] = [];
    // const Volt: any[] = [];

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
      },
      // {
      //   values: Volt,
      //   key: 'Bat V',
      //   color: '#123d9e'
      // },
    ];
  }

}
