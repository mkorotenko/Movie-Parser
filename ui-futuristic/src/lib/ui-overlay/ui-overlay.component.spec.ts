import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiOverlayComponent } from './ui-overlay.component';

describe('UiOverlayComponent', () => {
  let component: UiOverlayComponent;
  let fixture: ComponentFixture<UiOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
