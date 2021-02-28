import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { PaginationService } from 'ngx-pagination';
import { combineLatest } from 'rxjs';
import { SearchRequest, SearchTypes } from '../movie-search/movie-search.component';
import { SortTypes } from '../movie-sort/movie-sort.component';

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

    public filterList = [
        {
            title: '2021 год',
            link: '/movies/1?year=2021'
        },
        {
            title: '2020 год',
            link: '/movies/1?year=2020'
        },
        {
            title: '2019 год',
            link: '/movies/1?year=2019'
        }
    ]
    public genreList = [
        {
            title: 'Мультфильмы',
            link: '/movies/1?genre=мультф'
        },
        {
            title: 'Драмы',
            link: '/movies/1?genre=драм'
        },
        {
            title: 'Детективы',
            link: '/movies/1?genre=детект'
        },
        {
            title: 'Боевики',
            link: '/movies/1?genre=боевик'
        },
        {
            title: 'Комедии',
            link: '/movies/1?genre=комед'
        },
        {
            title: 'Триллеры',
            link: '/movies/1?genre=триллер'
        },
        {
            title: 'Приключения',
            link: '/movies/1?genre=приключ'
        },
        {
            title: 'Фантастика',
            link: '/movies/1?genre=фантас'
        },
        {
            title: 'Фэнтези',
            link: '/movies/1?genre=фэнтез'
        },
        {
            title: 'Семейный',
            link: '/movies/1?genre=семейн'
        },
    ]
    private paginationConfig = {
        id: 'common',
        itemsPerPage: 20,
        currentPage: 1,
        totalItems: 100
    }

    public searchType: SearchTypes = 'searchText';

    public searchValue: any = '';

    public sortType: SortTypes = 'rating';

    constructor(
        private service: AppService,
        private aRoute: ActivatedRoute,
        private router: Router,
        private paginationService: PaginationService
    ) { }

    ngOnInit(): void {
        const currentQuery = this.aRoute.snapshot.queryParams || {};
        this.searchType = Object.keys(currentQuery)[0] as SearchTypes || 'searchText';

        //auto routing to first filter
        if (this.router.url === '/movies/1') {
            const request = this.filterList[0].link;
            const qParams = request.split('?')[1];
            if (qParams) {
                const paramsParts = qParams.split('=');
                this.onSearch({
                    type: paramsParts[0] as SearchTypes,
                    value: paramsParts[1]
                });
            }
        }

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
            let reqParams = this.getRequesrParameters(params);

            if (!Object.keys(reqParams).length) {
                reqParams = undefined;
            }
            this.service.reqParameters$.next(reqParams);
        });

        combineLatest(
            this.aRoute.params,
            this.service.movieCount$
        ).pipe(
            distinctUntilChanged((prev, curr) => prev[0] === curr[0] && prev[1] === curr[1])
        ).subscribe(([params, itemsCount]) => {
            var instance = this.createPaginationInstance([], {
                ...this.paginationConfig,
                currentPage: Number(params.id),
                totalItems: itemsCount
            });
            this.paginationService.register(instance);
        });
    }

    public onSearch(request: SearchRequest) {
        this.router.navigate(['/movies/1'], {
            queryParams: { [request.type]: request.value },
            relativeTo: this.aRoute
        });
    }

    public onPageChange(page: number) {
        this.router.navigate(['movies', page], {
            queryParams: this.aRoute.snapshot.queryParams
        });
    }

    public onSortChange(sortType: SortTypes) {
        const queryParams = this.aRoute.snapshot.queryParams;
        this.router.navigate(['/movies/1'], {
            queryParams: { 
                ...queryParams,
                sort: sortType
            },
            relativeTo: this.aRoute
        });
    }

    private getRequesrParameters(params) {
        return Object.keys(params)
        .reduce((result: any, keyName: SearchTypes | string) => {
            const paramValue = params[keyName];
            if (!paramValue) {
                return result;
            }
            if (keyName === 'sort') {
                result[keyName]=paramValue;
                this.sortType = paramValue;
            } else {
                switch (keyName) {
                    case 'genre':
                        result['details.Genre_ex']=paramValue;
                        break;
                    case 'actor':
                        result['details.Actors_ex']=paramValue;
                        break;
                    case 'country':
                        result['details.Country_ex']=paramValue;
                        break;
                    case 'searchText':
                        result['title_ex']=paramValue;
                        break;
                    default:
                        result[keyName]=paramValue;
                }
                this.searchType = keyName as SearchTypes;
                this.searchValue = paramValue;
            }
            return result;
        }, {});
    }

    private createPaginationInstance(collection, config) {
        var required = ['itemsPerPage', 'currentPage'];
        var missing = required.filter(function (prop) { return !(prop in config); });
        if (0 < missing.length) {
            throw new Error("PaginatePipe: Argument is missing the following required properties: " + missing.join(', '));
        }
        return {
            id: config.id != null ? config.id : this.paginationService.defaultId(),
            itemsPerPage: +config.itemsPerPage || 0,
            currentPage: +config.currentPage || 1,
            totalItems: +config.totalItems || collection.length
        };
    }

}
