import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdEnergyListingComponent } from './sd-energy-listing.component';

describe('SdEnergyListingComponent', () => {
  let component: SdEnergyListingComponent;
  let fixture: ComponentFixture<SdEnergyListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdEnergyListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdEnergyListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
