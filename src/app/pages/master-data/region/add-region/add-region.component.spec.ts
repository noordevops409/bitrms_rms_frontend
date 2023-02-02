import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegionComponent } from './add-region.component';

describe('AddRegionComponent', () => {
  let component: AddRegionComponent;
  let fixture: ComponentFixture<AddRegionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRegionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
