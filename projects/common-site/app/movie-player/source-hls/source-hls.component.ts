import { Component, Input, ElementRef, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';

interface HLSResponse {
    type: string;
    details: string;
    fatal: boolean;
    url: string;
    response?: {
        code: string;
        text: string;
    };
    loader: any;
}
@Component({
    selector: 'source-hls',
    template: '',
    styleUrls: ['./source-hls.component.scss']
})
export class SourceHlsComponent implements OnChanges {

    @Input() player: ElementRef;

    @Input() src: any;

    @Output() error = new EventEmitter();

    private hls: any;

    ngOnInit() {
        this.createPlayer();
        if (this.src) {
            this.hls.loadSource(this.src);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.destroyPlayer();
        this.createPlayer();
        if (changes.src && this.hls) {
            if (this.src) {
                this.hls.loadSource(this.src);
            }
        }
    }

    private createPlayer() {
        if (this.hls) {
            return;
        }

        const Hls = window['Hls'];

        const playerNode = this.player.nativeElement;
        if (Hls.isSupported()) {
            let hls = this.hls = new Hls();
            hls.attachMedia(playerNode);
            hls.on('hlsError', (error: string, response: HLSResponse)=>{
                this.error.emit((response.response && response.response.text) || 'Load error');
                console.info('app resp:', response);
                let event = null;
                try {
                    const loader = (response.loader && response.loader.loader) || { status:0, statusText: response.type }
                    event = new (window as any).ErrorEvent('error', {
                        error: {
                            responseCode: loader.status,
                            message: loader.statusText
                        },
                        message: response.type
                    });
                } catch (err) {
                  //for IE11
                  event = document.createEvent('Event');
                  event.initEvent('error', false, false, new Error(response.type));
                }
                playerNode.dispatchEvent(event);
            })

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

    private destroyPlayer() {
        if (this.hls) {
            this.hls.detachMedia();
            this.hls.destroy();
            this.hls = undefined;
        }
    }

}
