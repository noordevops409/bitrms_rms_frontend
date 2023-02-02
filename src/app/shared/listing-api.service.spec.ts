import { TestBed } from '@angular/core/testing';

import { ListingApiService } from './listing-api.service';

describe('ListingApiService', () => {
  let service: ListingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
