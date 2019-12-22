import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { take } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nc-movie-player-mp4',
  templateUrl: './movie-player-mp4.component.html',
  styleUrls: ['./movie-player-mp4.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviePlayerMP4Component implements OnInit {

  @ViewChild('player', {static: true, read: ElementRef}) playerNode: ElementRef;
  poster: string;
  src:string;
  srcHLS: string;
  constructor(
    private router: ActivatedRoute,
    private service: AppService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.poster = `api/acc/image/${this.router.snapshot.params['id'] || ''}`;
    const sourceType = this.router.snapshot.params['source'];
    if (sourceType === 'streams') {
      this.service.getStream(
        this.router.snapshot.params['id'],
        this.router.snapshot.params['num']
      ).pipe(take(1)).subscribe(src => {
        this.srcHLS = src;
        this.cd.detectChanges();
      });
    } else {
      this.service.getLinks(this.router.snapshot.params['id']).pipe(
        take(1)
      ).subscribe(s => {
        this.src = s[sourceType][this.router.snapshot.params['num']];
        this.cd.detectChanges();
      });
    }

    this.playerNode.nativeElement.focus();
  }

}
