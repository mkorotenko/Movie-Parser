import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.component.html',
  styleUrls: ['./ui-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCardComponent {
  plain = true;

}
