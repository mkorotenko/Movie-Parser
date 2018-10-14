import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nc-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  @Input() title: string;
  @Input() rating: string;
  @Input() href: string;
  @Input() image: string;

  constructor() { }

  ngOnInit() {
  }

}
