import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as ConsoleLog from 'console-log-html';
@Component({
  selector: 'rpi-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogComponent implements OnInit, OnDestroy {

  @ViewChild('logNode', {static: true}) logNode: ElementRef;

  ngOnInit() {
    ConsoleLog.connect(this.logNode.nativeElement);
  }

  ngOnDestroy() {
    ConsoleLog.disconnect();
  }

}
