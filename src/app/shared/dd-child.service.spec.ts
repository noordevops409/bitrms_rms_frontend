import { TestBed } from '@angular/core/testing';

import { DdChildService } from './dd-child.service';

describe('DdChildService', () => {
  let service: DdChildService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DdChildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
