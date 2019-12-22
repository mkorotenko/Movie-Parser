import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nc-movie-player-mp4',
  templateUrl: './movie-player-mp4.component.html',
  styleUrls: ['./movie-player-mp4.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviePlayerMP4Component implements OnInit {

  @ViewChild('player', {static: true, read: ElementRef}) playerNode: ElementRef;

  src = 'http://magic.wwww.kinogo.cc/95f1823eadad62d85c06ca4166e87f2d:2019122319/filmzzz/supersemeyka-2004_1524614440.mp4';
  poster = 'api/acc/image/5c75043ef430cb4344b552fc';

  srcHLS: any;
  constructor(
    private router: ActivatedRoute,
    private service: AppService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
// this.router.snapshot.params.file
    this.service.getStream(
      this.router.snapshot.params['id'],
      this.router.snapshot.params['num']
    ).subscribe(src => {
      console.info('app src:', src);
      this.srcHLS = src;
      this.cd.detectChanges();
    });
  }

}
