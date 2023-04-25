import { TestBed } from '@angular/core/testing';

import { WindowsNotificationService } from './windows-notification.service';

describe('WindowsNotificationService', () => {
  let service: WindowsNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowsNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
