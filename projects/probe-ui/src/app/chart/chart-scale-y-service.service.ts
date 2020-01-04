import { Injectable } from '@angular/core';

@Injectable()
export class ChartScaleYServiceService {

    public yScaleD3: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number>;

}
