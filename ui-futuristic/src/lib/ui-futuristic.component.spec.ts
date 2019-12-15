import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFuturisticComponent } from './ui-futuristic.component';

describe('UiFuturisticComponent', () => {
  let component: UiFuturisticComponent;
  let fixture: ComponentFixture<UiFuturisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiFuturisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiFuturisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
