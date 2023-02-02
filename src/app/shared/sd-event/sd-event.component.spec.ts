import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdEventComponent } from './sd-event.component';

describe('SdEventComponent', () => {
  let component: SdEventComponent;
  let fixture: ComponentFixture<SdEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
