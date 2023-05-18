import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgPreviewComponent } from './img-preview.component';

describe('ImgPreviewComponent', () => {
  let component: ImgPreviewComponent;
  let fixture: ComponentFixture<ImgPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
