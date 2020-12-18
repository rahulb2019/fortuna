import { TestBed } from '@angular/core/testing';

import { MimicService } from './mimic.service';

describe('MimicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MimicService = TestBed.get(MimicService);
    expect(service).toBeTruthy();
  });
});
