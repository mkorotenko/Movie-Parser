import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadsManagerComponent } from './threads-manager.component';

describe('ThreadsManagerComponent', () => {
  let component: ThreadsManagerComponent;
  let fixture: ComponentFixture<ThreadsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
