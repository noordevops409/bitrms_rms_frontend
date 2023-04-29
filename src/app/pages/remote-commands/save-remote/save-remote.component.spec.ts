import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveRemoteComponent } from './save-remote.component';

describe('SaveRemoteComponent', () => {
  let component: SaveRemoteComponent;
  let fixture: ComponentFixture<SaveRemoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveRemoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveRemoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
