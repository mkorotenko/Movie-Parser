import { TestBed } from '@angular/core/testing';

import { UiFuturisticService } from './ui-futuristic.service';

describe('UiFuturisticService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UiFuturisticService = TestBed.get(UiFuturisticService);
    expect(service).toBeTruthy();
  });
});
