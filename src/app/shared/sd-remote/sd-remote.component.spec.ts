import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdRemoteComponent } from './sd-remote.component';

describe('SdRemoteComponent', () => {
  let component: SdRemoteComponent;
  let fixture: ComponentFixture<SdRemoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdRemoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdRemoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
