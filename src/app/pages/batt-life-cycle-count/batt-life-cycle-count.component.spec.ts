import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BattLifeCycleCountComponent } from './batt-life-cycle-count.component';


describe('BattLifeCycleCountComponent', () => {
  let component: BattLifeCycleCountComponent;
  let fixture: ComponentFixture<BattLifeCycleCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattLifeCycleCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattLifeCycleCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
