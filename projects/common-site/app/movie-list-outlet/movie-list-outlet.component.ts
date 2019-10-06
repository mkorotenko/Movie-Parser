import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'nc-movie-list-outlet',
  templateUrl: './movie-list-outlet.component.html',
  styleUrls: ['./movie-list-outlet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListOutletComponent implements OnInit {

  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('actorInput') actorInput: ElementRef;
  @ViewChild('genreInput') genreInput: ElementRef;
  @ViewChild('yearInput') yearInput: ElementRef;
  @ViewChild('content') content: ElementRef;
  
  public title = 'common-site';

  public params$ = this.aRoute.queryParams.pipe(
    map(params => params),
    shareReplay(1)
  );

  public pages$ = this.service.movieCount$.pipe(
    map((count) => {
      const pageCount = Math.round(Number(count) / 20 + .5);
      const res = new Array(pageCount);
      for (let i = 0; i < pageCount; i++) {
        res[i] = i + 1;
      }
      return res;
    })
  );
  
  constructor(
    private service: AppService,
    private aRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.content.nativeElement.scrollTo(0,0);
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

}
