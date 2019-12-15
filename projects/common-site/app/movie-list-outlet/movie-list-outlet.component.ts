import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { PaginationService } from 'ngx-pagination';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'nc-movie-list-outlet',
  templateUrl: './movie-list-outlet.component.html',
  styleUrls: ['./movie-list-outlet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListOutletComponent implements OnInit {

  @ViewChild('titleInput', {static: true}) titleInput: ElementRef;
  @ViewChild('actorInput', {static: true}) actorInput: ElementRef;
  @ViewChild('genreInput', {static: true}) genreInput: ElementRef;
  @ViewChild('yearInput', {static: true}) yearInput: ElementRef;
  @ViewChild('content', {static: true}) content: ElementRef;
  
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
  
  constructor(
    private service: AppService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        try{
          this.content.nativeElement.scrollTo(0,0);
        } catch(error) {
          console.error(error);
        }
      }
    });

    this.aRoute.queryParams.subscribe(params => {

      if (params.genre) {
        this.genreInput.nativeElement.value = params.genre;
        this.actorInput.nativeElement.value = '';
        this.yearInput.nativeElement.value = '';
        this.titleInput.nativeElement.value = '';
        this.service.reqParameters$.next({
          'details.Genre_ex': params.genre
        });
      } else if (params.actor) {
        this.genreInput.nativeElement.value = '';
        this.actorInput.nativeElement.value = params.actor;
        this.yearInput.nativeElement.value = '';
        this.titleInput.nativeElement.value = '';
        this.service.reqParameters$.next({
          'details.Actors_ex': params.actor
        });
      } else if (params.year) {
        this.genreInput.nativeElement.value = '';
        this.actorInput.nativeElement.value = '';
        this.yearInput.nativeElement.value = params.year;
        this.titleInput.nativeElement.value = '';
        this.service.reqParameters$.next({
          rating_gt: 4.3,
          'year': params.year
        });
      } else if (params.searchText) {
        this.genreInput.nativeElement.value = '';
        this.actorInput.nativeElement.value = '';
        this.yearInput.nativeElement.value = '';
        this.titleInput.nativeElement.value = params.searchText;
        this.service.reqParameters$.next({
          title_ex: params.searchText
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
  public onSearch(text) {
    const query = {};
    if (text) {
      query['searchText'] = text;
    }
    this.router.navigate(['/movies/1'], {
      queryParams: query,
      relativeTo: this.aRoute
    });
  }

  public onYearSearch(text) {
    const query = {};
    if (text) {
      query['year'] = text;
    }
    this.router.navigate(['/movies/1'], {
      queryParams: query,
      relativeTo: this.aRoute
    });
  }
  
  public onActorSearch(text) {
    const query = {};
    if (text) {
      query['actor'] = text;
    }
    this.router.navigate(['/movies/1'], {
      queryParams: query,
      relativeTo: this.aRoute
    });
  }

  public onGenreSearch(text) {
    const query = {};
    if (text) {
      query['genre'] = text;
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
