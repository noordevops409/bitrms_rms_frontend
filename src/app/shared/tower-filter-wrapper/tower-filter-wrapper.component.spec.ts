import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowerFilterWrapperComponent } from './tower-filter-wrapper.component';

describe('TowerFilterWrapperComponent', () => {
  let component: TowerFilterWrapperComponent;
  let fixture: ComponentFixture<TowerFilterWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TowerFilterWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TowerFilterWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
