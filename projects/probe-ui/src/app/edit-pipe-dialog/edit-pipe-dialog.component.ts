import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-pipe-dialog',
  templateUrl: './edit-pipe-dialog.component.html',
  styleUrls: ['./edit-pipe-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPipeDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditPipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
