import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteCommandsComponent } from './remote-commands.component';

describe('RemoteCommandsComponent', () => {
  let component: RemoteCommandsComponent;
  let fixture: ComponentFixture<RemoteCommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoteCommandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
