import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LithLatestdataComponent } from './lith-latestdata.component';

describe('LithLatestdataComponent', () => {
  let component: LithLatestdataComponent;
  let fixture: ComponentFixture<LithLatestdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LithLatestdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LithLatestdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
