import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdSummaryListingComponent } from './sd-summary-listing.component';

describe('SdSummaryListingComponent', () => {
  let component: SdSummaryListingComponent;
  let fixture: ComponentFixture<SdSummaryListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdSummaryListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdSummaryListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
