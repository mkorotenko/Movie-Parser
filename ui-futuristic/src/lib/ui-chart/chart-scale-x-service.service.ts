import { Injectable } from '@angular/core';

@Injectable()
export class ChartScaleXServiceService {

    public xScaleD3: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number>;

}
