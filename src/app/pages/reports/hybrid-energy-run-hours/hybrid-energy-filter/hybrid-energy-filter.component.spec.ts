import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HybridEnergyFilterComponent } from './hybrid-energy-filter.component';

describe('HybridEnergyFilterComponent', () => {
  let component: HybridEnergyFilterComponent;
  let fixture: ComponentFixture<HybridEnergyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HybridEnergyFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HybridEnergyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
