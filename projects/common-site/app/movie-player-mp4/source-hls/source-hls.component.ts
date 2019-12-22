import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'source-hls',
  template: '',
  styleUrls: ['./source-hls.component.scss']
})
export class SourceHlsComponent implements OnInit {

  @Input() player: ElementRef;

  @Input() src: any;

  ngOnInit() {
    const Hls = window['Hls'];

    const playerNode = this.player.nativeElement;
    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(this.src);
      hls.attachMedia(playerNode);

      if (playerNode) {
        playerNode.addEventListener('canplay', () => {
          playerNode['play']()
            .catch(error => console.error(error));
        });  
      }
    } else {
      console.error('HLS codec not supported', this);
    }
  }

}
