import { TestBed } from '@angular/core/testing';

import { HttpResponseIntercepterService } from './http-response-intercepter.service';

describe('HttpResponseIntercepterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpResponseIntercepterService = TestBed.get(HttpResponseIntercepterService);
    expect(service).toBeTruthy();
  });
});
