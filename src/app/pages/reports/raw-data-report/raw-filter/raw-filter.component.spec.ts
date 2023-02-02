import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawFilterComponent } from './raw-filter.component';

describe('RawFilterComponent', () => {
  let component: RawFilterComponent;
  let fixture: ComponentFixture<RawFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RawFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
