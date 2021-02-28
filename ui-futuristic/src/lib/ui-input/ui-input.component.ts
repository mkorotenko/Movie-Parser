import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ui-input',
    templateUrl: './ui-input.component.html',
    styleUrls: ['./ui-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiInputComponent {
    @Input() value: string;
    @Output() valueChange = new EventEmitter<string>();
}
