import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LithiumService } from './lithium.service';
import { UserService } from './user.service';
import { ApiConstant } from '../api-constant.enum';

describe('LithiumService', () => {
  let service: LithiumService;
  let httpMock: HttpTestingController;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['getAuthToken']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LithiumService,
        { provide: UserService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(LithiumService);
    httpMock = TestBed.inject(HttpTestingController);
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch lithium part 1 data with user ID', () => {
    const mockAuthToken = { userId: '123' };
    userServiceSpy.getAuthToken.and.returnValue(mockAuthToken);
    
    const mockData = [{ id: 1, name: 'Test' }];
    
    service.getLithiumPart1().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${ApiConstant.getLithPart1}?userId=123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch lithium part 2 data with user ID', () => {
    const mockAuthToken = { userId: '123' };
    userServiceSpy.getAuthToken.and.returnValue(mockAuthToken);
    
    const mockData = [{ id: 1, name: 'Test' }];
    
    service.getLithiumPart2().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${ApiConstant.getLithPart2}?userId=123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});