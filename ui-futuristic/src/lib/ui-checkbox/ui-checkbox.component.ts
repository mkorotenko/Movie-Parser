import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

type ControlTypes = 'slide' | 'switch' | 'switch-two' | 'round' | 'square';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.component.html',
  styleUrls: ['./ui-checkbox.component.scss']
})
export class UiCheckboxComponent {

  @HostBinding('class')
  @Input()
  type: ControlTypes = 'round';

  entityId = this.generateId();

  @Input() checked: boolean;

  @Output() checkedChange = new EventEmitter<boolean>();

  private generateId(): string {
    // tslint:disable-next-line: no-bitwise
    return ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
  }

}
