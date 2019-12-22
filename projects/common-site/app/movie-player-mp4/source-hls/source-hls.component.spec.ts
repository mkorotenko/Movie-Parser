import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceHlsComponent } from './source-hls.component';

describe('SourceHlsComponent', () => {
  let component: SourceHlsComponent;
  let fixture: ComponentFixture<SourceHlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceHlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceHlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
