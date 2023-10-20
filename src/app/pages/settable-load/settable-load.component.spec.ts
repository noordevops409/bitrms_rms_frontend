import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettableLoadComponent } from './settable-load.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('SettableLoadComponent', () => {
  let component: SettableLoadComponent;
  let fixture: ComponentFixture<SettableLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettableLoadComponent ],
      imports: [
        RouterTestingModule,
        FormsModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettableLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
