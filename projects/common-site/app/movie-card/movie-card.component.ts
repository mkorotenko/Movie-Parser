import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nc-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit, OnChanges {

  @Input() title: string;
  @Input() rating: string;
  @Input() href: string;
  @Input() image: string;
  @Input() genre: string;
  @Input() quality: string;
  @Input() year: string;
  @Input() description: string;
  @Input() movieID: string;

  public imgSrc = '';

  public hasLinks$ = new BehaviorSubject(false);

  public links$: Observable<any>;

  constructor(
    private service: AppService,
  ) { }

  ngOnInit() {
    this.links$ = this.service.getLinks(this.movieID);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.image) {
      this.imgSrc = `api/acc/image/${this.image}`;
    }
  }

  public fileExt(path: string) {
    return path.split('.').pop();
  }

  public onSearchFiles() {
    this.hasLinks$.next(true);
  }

}
