import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeeEnergyFilterComponent } from './tee-energy-filter.component';

describe('TeeEnergyFilterComponent', () => {
  let component: TeeEnergyFilterComponent;
  let fixture: ComponentFixture<TeeEnergyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeeEnergyFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeeEnergyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
