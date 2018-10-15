import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nc-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  @Input() title: string;
  @Input() rating: string;
  @Input() href: string;
  @Input() image: string;
  @Input() genre: string;
  @Input() quality: string;
  @Input() year: string;

  constructor() { }

  ngOnInit() {
  }

}
