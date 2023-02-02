import { TestBed } from '@angular/core/testing';

import { CustomDatepickerService } from './custom-datepicker.service';

describe('CustomDatepickerService', () => {
  let service: CustomDatepickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomDatepickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
