import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

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
  @Input() links: string[];

  public imgSrc = '';

  constructor(
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.image) {
      this.imgSrc = `api/acc/image/${this.image}`;
    }
  }

  public fileExt(path: string) {
    return path.split('.').pop();
  }
}
