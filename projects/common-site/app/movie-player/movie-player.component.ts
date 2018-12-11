import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nc-movie-player',
  templateUrl: './movie-player.component.html',
  styleUrls: ['./movie-player.component.scss']
})
export class MoviePlayerComponent implements OnInit, OnChanges {

  constructor(
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    const videojs = window['videojs'];
    var player = videojs('vid1');
    player.src({
      src: 'api/acc/file/' + this.router.snapshot.params.file
      //type: 'application/x-mpegURL',
      //withCredentials: true
    });
    //player.play();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

}
