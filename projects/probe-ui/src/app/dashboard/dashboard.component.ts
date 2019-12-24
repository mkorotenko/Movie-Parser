import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Observable, Subject } from 'rxjs';
import { MatSlideToggleChange, MatDialog } from '@angular/material';
import { SocketService } from '../pipe-card/socket.service';
import { takeUntil, take } from 'rxjs/operators';
import { EditPipeDialogComponent } from '../edit-pipe-dialog/edit-pipe-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  debug$: Observable<boolean> = this.localStorage.createFlow('debug_mode', false);

  pipeList$: Observable<number[]> = this.localStorage.createFlow('pipe_list', []);

  private destroy$: Subject<void> = new Subject();
  constructor(
    private localStorage: LocalStorageService,
    private socketService: SocketService,
    private dialog: MatDialog
  ) {
  }
  ngOnInit() {
    this.debug$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(debug => this.socketService.setDebugMode(debug));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onDebugModeChange(event: MatSlideToggleChange) {
    this.localStorage.setItem('debug_mode', event.checked);
  }

  onOpenDialog(): void {
    const dialogRef = this.dialog.open(EditPipeDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().pipe(
      take(1)
    ).subscribe(result => {
      if (result) {
        const newPipe: number = Number(result);
        this.pipeList$.pipe(
          take(1)
        ).subscribe(pipes => {
          if (pipes.includes(newPipe)) {
            return;
          }
          pipes.push(newPipe);
          this.localStorage.setItem('pipe_list', pipes);
        });
      }
    });
  }

  onDeletePipe(pipe: number): void {
    this.pipeList$.pipe(
      take(1)
    ).subscribe(pipes => {
      if (pipes.includes(pipe)) {
        pipes.splice(pipes.indexOf(pipe), 1);
        this.localStorage.setItem('pipe_list', pipes);
      }
    });
  }
}
