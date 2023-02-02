import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcaMasterComponent } from './rca-master.component';

describe('RcaMasterComponent', () => {
  let component: RcaMasterComponent;
  let fixture: ComponentFixture<RcaMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcaMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcaMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
