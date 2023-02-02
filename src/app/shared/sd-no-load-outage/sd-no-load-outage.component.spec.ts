import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdNoLoadOutageComponent } from './sd-no-load-outage.component';

describe('SdNoLoadOutageComponent', () => {
  let component: SdNoLoadOutageComponent;
  let fixture: ComponentFixture<SdNoLoadOutageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdNoLoadOutageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdNoLoadOutageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
