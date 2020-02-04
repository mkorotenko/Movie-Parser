import { Component, OnInit, Input, ElementRef, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { SourceType } from '../models/types';

interface FLVResponse {
    code: number;
    msg: string;
}

const FLVTypes = {
    'MP4': 'mp4',
    'FLV': 'flv'
}
@Component({
    selector: 'source-flv',
    template: '',
    styleUrls: ['./source-flv.component.scss']
})
export class SourceFlvComponent implements OnChanges {

    @Input() player: ElementRef;

    @Input() src: any;

    @Input() type: SourceType;

    @Output() error = new EventEmitter();

    private flvPlayer: any;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.src) {
            this.destroyPlayer();
            if (this.src) {
                this.createPlayer();
            }
        }
    }

    private createPlayer() {
        if (this.flvPlayer) {
            return;
        }

        const flvjs = window['flvjs'];

        const playerNode = this.player.nativeElement;
        if (flvjs.isSupported()) {
            let flvPlayer = this.flvPlayer = flvjs.createPlayer(
                {
                    type: FLVTypes[this.type] || 'flv',
                    url: this.src
                },
                // {
                //     lazyLoad: false
                // }
            );

            flvPlayer.attachMediaElement(playerNode);
            flvPlayer.load();
            flvPlayer.on('METADATA_ARRIVED', () => flvPlayer.play());
            flvPlayer.on('error', (arg1: string, arg2: string, response: FLVResponse) => {
                this.error.emit(response.msg);
                let event = null;
                try {
                    event = new (window as any).ErrorEvent('error', {
                        error: {
                            responseCode: response.code,
                            message: response.msg
                        },
                        message: response.msg
                    });
                } catch (err) {
                  //for IE11
                  event = document.createEvent('Event');
                  event.initEvent('error', false, false, new Error(response.msg));
                }
                playerNode.dispatchEvent(event);
            });
        } else {
            console.error('FLV source not supported', this);
        }
    }

    private destroyPlayer() {
        if (!this.flvPlayer) {
            return;
        }

        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy();
        this.flvPlayer = undefined;
    }

}
