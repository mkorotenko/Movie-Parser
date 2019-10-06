import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieListOutletComponent } from './movie-list-outlet.component';

describe('MovieListOutletComponent', () => {
  let component: MovieListOutletComponent;
  let fixture: ComponentFixture<MovieListOutletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieListOutletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieListOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
