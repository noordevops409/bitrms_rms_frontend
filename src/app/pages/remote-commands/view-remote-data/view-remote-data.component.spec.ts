import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRemoteDataComponent } from './view-remote-data.component';

describe('ViewRemoteDataComponent', () => {
  let component: ViewRemoteDataComponent;
  let fixture: ComponentFixture<ViewRemoteDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRemoteDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRemoteDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
