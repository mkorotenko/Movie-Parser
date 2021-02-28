import { Component } from '@angular/core';

@Component({
  selector: 'bldc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  onInput(value: string) {
    console.info('app INPUT:', value);
  }
}
