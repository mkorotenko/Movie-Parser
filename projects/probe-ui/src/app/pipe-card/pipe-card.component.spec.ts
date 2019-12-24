import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeCardComponent } from './pipe-card.component';

describe('PipeCardComponent', () => {
  let component: PipeCardComponent;
  let fixture: ComponentFixture<PipeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
