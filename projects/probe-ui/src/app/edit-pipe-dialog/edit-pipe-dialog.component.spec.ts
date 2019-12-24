import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPipeDialogComponent } from './edit-pipe-dialog.component';

describe('EditPipeDialogComponent', () => {
  let component: EditPipeDialogComponent;
  let fixture: ComponentFixture<EditPipeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPipeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPipeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
