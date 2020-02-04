import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiTabComponent } from './ui-tab/ui-tab.component';
import { UiTabGroupComponent } from './ui-tab-group/ui-tab-group.component';

@NgModule({
    declarations: [
        UiTabComponent,
        UiTabGroupComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        UiTabComponent,
        UiTabGroupComponent
    ]
})
export class UiTabsModule { }
