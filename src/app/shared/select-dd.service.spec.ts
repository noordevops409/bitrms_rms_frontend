import { TestBed } from '@angular/core/testing';

import { SelectDdService } from './select-dd.service';

describe('SelectDdService', () => {
  let service: SelectDdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectDdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
