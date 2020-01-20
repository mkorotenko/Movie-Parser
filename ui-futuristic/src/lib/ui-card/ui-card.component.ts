import { Component, ChangeDetectionStrategy } from '@angular/core';

const AUGMENT_LIST = [
  'tl-clip',
  'tr-clip',
  'bl-clip',
  'br-clip',
  'l-clip-y',
  'r-clip-y',
  'b-clip-x',
  'tr-clip-x'
];

@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.component.html',
  styleUrls: ['./ui-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCardComponent {
  plain = true;

  augmented = !this.plain && `${AUGMENT_LIST.join(' ')} exe`;
}
