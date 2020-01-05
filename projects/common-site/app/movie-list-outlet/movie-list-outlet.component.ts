import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { PaginationService } from 'ngx-pagination';
import { combineLatest } from 'rxjs';
import { SearchRequest, SearchTypes } from '../movie-search/movie-search.component';

@Component({
    selector: 'nc-movie-list-outlet',
    templateUrl: './movie-list-outlet.component.html',
    styleUrls: ['./movie-list-outlet.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListOutletComponent implements OnInit {

    @ViewChild('content', { static: true, read: ElementRef }) content: ElementRef;

    public title = 'common-site';

    public params$ = this.aRoute.queryParams.pipe(
        map(params => params),
        shareReplay(1)
    );

    private paginationConfig = {
        id: 'common',
        itemsPerPage: 20,
        currentPage: 1,
        totalItems: 100
    }

    public searchType: SearchTypes = 'searchText';

    public searchValue: any = '';

    constructor(
        private service: AppService,
        private aRoute: ActivatedRoute,
        private router: Router,
        private paginationService: PaginationService
    ) { }

    ngOnInit(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                try {
                    this.content.nativeElement.scrollTo(0, 0);
                } catch (error) {
                    console.error(error);
                }
            }
        });

        this.aRoute.queryParams.subscribe(params => {

            if (params.genre) {
                this.searchType = 'genre';
                this.searchValue = params.genre
                this.service.reqParameters$.next({
                    'details.Genre_ex': params.genre
                });
            } else if (params.actor) {
                this.searchType = 'actor';
                this.searchValue = params.actor
                this.service.reqParameters$.next({
                    'details.Actors_ex': params.actor
                });
            } else if (params.year) {
                this.searchType = 'year';
                this.searchValue = params.year
                this.service.reqParameters$.next({
                    'year': params.year
                });
            } else if (params.searchText) {
                this.searchType = 'searchText';
                this.searchValue = params.searchText
                this.service.reqParameters$.next({
                    'title_ex': params.searchText
                });
            } else {
                this.service.reqParameters$.next(undefined);
            }
        });

        combineLatest(
            this.aRoute.params,
            this.service.movieCount$
        ).pipe(
            distinctUntilChanged((prev, curr) => prev[0] === curr[0] && prev[1] === curr[1])
        ).subscribe(([params, itemsCount]) => {
            var instance = this.createInstance([], {
                ...this.paginationConfig,
                currentPage: Number(params.id),
                totalItems: itemsCount
            });
            this.paginationService.register(instance);
        });
    }

    public onSearch(request: SearchRequest) {
        const query = {};
        if (request.value) {
            query[request.type] = request.value;
        }
        this.router.navigate(['/movies/1'], {
            queryParams: query,
            relativeTo: this.aRoute
        });
    }

    public onPageChange(page: number) {
        this.router.navigate(['movies', page], {
            queryParams: this.aRoute.snapshot.queryParams
        });
    }

    private createInstance(collection, config) {
        this.checkConfig(config);
        return {
            id: config.id != null ? config.id : this.paginationService.defaultId(),
            itemsPerPage: +config.itemsPerPage || 0,
            currentPage: +config.currentPage || 1,
            totalItems: +config.totalItems || collection.length
        };
    }

    private checkConfig(config) {
        var required = ['itemsPerPage', 'currentPage'];
        var missing = required.filter(function (prop) { return !(prop in config); });
        if (0 < missing.length) {
            throw new Error("PaginatePipe: Argument is missing the following required properties: " + missing.join(', '));
        }
    };

}
