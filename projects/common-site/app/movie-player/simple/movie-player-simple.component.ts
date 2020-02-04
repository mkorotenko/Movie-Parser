import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { AppService } from '../../app.service';
import { SourceType, MovieStreamItem } from '../models/types';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'nc-movie-player-simple',
    templateUrl: './movie-player-simple.component.html',
    styleUrls: ['./movie-player-simple.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviePlayerSimpleComponent implements OnInit {

    @ViewChild('player', { static: true, read: ElementRef }) playerNode: ElementRef;
    poster: string;
    src: string;
    srcHLS: string;
    srcFLV: string;

    sourceType: SourceType;

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
            ).subscribe(links => {
                const currentSource: string | MovieStreamItem = links[sourceType][this.router.snapshot.params['num']];
                let srcPath: string;
                if (typeof currentSource === 'string') {
                    srcPath = currentSource;
                } else {
                    srcPath = currentSource.source;
                }
                if (srcPath.includes('.flv')){
                    this.sourceType = 'FLV';
                    this.srcFLV = `api/acc/proxyDirect/${this.router.snapshot.params['id']}/${this.router.snapshot.params['num']}`;
                } else if (srcPath.includes('.mp4')) {
                    this.sourceType = 'MP4';
                    this.srcFLV = `api/acc/proxyDirect/${this.router.snapshot.params['id']}/${this.router.snapshot.params['num']}`;
                } else {
                    this.src = srcPath;
                }
                this.cd.detectChanges();
            });
        }

        this.playerNode.nativeElement.focus();
    }

}
