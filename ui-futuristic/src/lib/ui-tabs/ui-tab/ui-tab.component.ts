import { Component, ChangeDetectionStrategy, Input, HostBinding, ChangeDetectorRef } from '@angular/core';
import { UiTabGroupComponent } from '../ui-tab-group/ui-tab-group.component';

@Component({
    selector: 'ui-tab',
    templateUrl: './ui-tab.component.html',
    styleUrls: ['./ui-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTabComponent {

    @Input() title: string;

    @HostBinding('class.active')
    @Input() active: boolean;

    updateGroup: (tab: UiTabComponent) => void;

    constructor(
        public cd: ChangeDetectorRef
    ) {}

    onClick() {
        this.active = !this.active;
        if (this.updateGroup) {
            this.updateGroup(this);
        }
    }

    public setTabGroup(group: UiTabGroupComponent) {
        this.updateGroup = group.setActiveTab.bind(group);
    }
}
