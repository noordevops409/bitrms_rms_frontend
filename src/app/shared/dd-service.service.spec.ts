import { TestBed } from '@angular/core/testing';

import { DdServiceService } from './dd-service.service';

describe('DdServiceService', () => {
  let service: DdServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DdServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
