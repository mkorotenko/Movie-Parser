import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieSortComponent } from './movie-sort.component';

describe('MovieSortComponent', () => {
  let component: MovieSortComponent;
  let fixture: ComponentFixture<MovieSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
