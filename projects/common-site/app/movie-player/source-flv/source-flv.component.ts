import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { SourceType } from '../models/types';

const FLVTypes = {
    'MP4': 'mp4',
    'FLV': 'flv'
}
@Component({
    selector: 'source-flv',
    template: '',
    styleUrls: ['./source-flv.component.scss']
})
export class SourceFlvComponent implements OnInit {

    @Input() player: ElementRef;

    @Input() src: any;

    @Input() type: SourceType;

    ngOnInit() {
        const flvjs = window['flvjs'];

        const playerNode = this.player.nativeElement;
        if (flvjs.isSupported()) {
            var flvPlayer = flvjs.createPlayer(
                {
                    type: FLVTypes[this.type] || 'flv',
                    url: this.src
                },
                // {
                //     stashInitialSize: '24576‬KB',
                //     lazyLoad: false
                // }
            );
            flvPlayer.attachMediaElement(playerNode);
            flvPlayer.load();
            flvPlayer.on('METADATA_ARRIVED', () => flvPlayer.play());
        } else {
            console.error('FLV source not supported', this);
        }
    }

}
