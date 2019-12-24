import { TestBed } from '@angular/core/testing';

import { ChartAPIService } from './chart-api.service';

describe('ChartAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartAPIService = TestBed.get(ChartAPIService);
    expect(service).toBeTruthy();
  });
});
