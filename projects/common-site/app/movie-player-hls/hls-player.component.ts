import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nc-hls-player',
  templateUrl: './hls-player.component.html',
  styleUrls: ['./hls-player.component.scss']
})
export class HLSPlayerComponent implements OnInit, OnChanges {

  constructor(
    private router: ActivatedRoute,
    private service: AppService,
  ) { }

  ngOnInit() {

    const video = document.getElementById('player');
    const Hls = window['Hls'];
    window['plyr'].setup(video);

    // const video: any = document.getElementById('video');
    this.service.getStream(
      this.router.snapshot.params['id'],
      this.router.snapshot.params['num']
    ).subscribe(s => {
      // if(Hls.isSupported()) {
      //   const hls: any = new Hls();
      //   hls.loadSource(s);
      //   hls.attachMedia(video);
      //   // hls.on(Hls.Events.MANIFEST_PARSED,function() {
      //   //   video.play();
      //   // });
      // }
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(s);
        hls.attachMedia(video);
        // hls.on(Hls.Events.BUFFER_CODECS,function() {
        //   video['play']();
        // });
        video.addEventListener('canplay', function () {
          video['play']()
          .catch(error => console.error(error));
        });
      }
    })

   // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
   // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
   // This is using the built-in support of the plain video element, without using hls.js.
    // else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    //   video.src = 'http://bk2-hls.kinokrad.co/hls/Pyatiy.Element.HDRip/playlist.m3u8';
    //   video.addEventListener('canplay',function() {
    //     video.play();
    //   });
    // }
  
  }

  ngOnChanges(changes: SimpleChanges) {
  }

}
