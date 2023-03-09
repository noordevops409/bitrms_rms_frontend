import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HybridPowerFilterComponent } from './hybrid-power-filter.component';

describe('HybridPowerFilterComponent', () => {
  let component: HybridPowerFilterComponent;
  let fixture: ComponentFixture<HybridPowerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HybridPowerFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HybridPowerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
