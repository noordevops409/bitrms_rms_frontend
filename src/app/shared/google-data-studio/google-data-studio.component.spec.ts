import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleDataStudioComponent } from './google-data-studio.component';

describe('GoogleDataStudioComponent', () => {
  let component: GoogleDataStudioComponent;
  let fixture: ComponentFixture<GoogleDataStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleDataStudioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleDataStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
