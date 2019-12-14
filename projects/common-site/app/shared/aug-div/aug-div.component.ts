import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

const AUGMENT_LIST = [
  'tl-clip',
  'tr-clip',
  'bl-clip',
  'br-clip',
  'l-clip-y',
  'r-clip-y',
  'b-clip-x',
  'tr-clip-x'
]

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'aug-div',
  templateUrl: './aug-div.component.html',
  styleUrls: ['./aug-div.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AugDivComponent {
  @HostBinding('class.plain')
  plain = true;
  
  @HostBinding('attr.augmented-ui')
  augmented = !this.plain && `${AUGMENT_LIST.join(' ')} exe`;
}
