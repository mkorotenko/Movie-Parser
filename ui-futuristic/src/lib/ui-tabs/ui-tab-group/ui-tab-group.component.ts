import {
    Component, QueryList, ContentChildren, Input, ChangeDetectorRef,
    SimpleChanges, ChangeDetectionStrategy, OnInit, OnChanges, AfterViewInit,
    AfterContentInit, OnDestroy, Output, EventEmitter
} from '@angular/core';
import { UiTabComponent } from '../ui-tab/ui-tab.component';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'ui-tab-group',
    templateUrl: './ui-tab-group.component.html',
    styleUrls: ['./ui-tab-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTabGroupComponent implements OnChanges, AfterViewInit, AfterContentInit, OnDestroy {

    @Input() activeTab = 0;

    @Output() activeTabChange = new EventEmitter<number>();

    @ContentChildren(UiTabComponent, { descendants: true })
    tabList: QueryList<UiTabComponent>;

    private unsubscribe = new Subject();

    constructor(
        public cd: ChangeDetectorRef
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.activeTab) {
            this.updateTabs();
        }
    }

    ngAfterContentInit() {
        this.tabList.changes
            .pipe(
                startWith(this.tabList),
                takeUntil(this.unsubscribe)
            )
            .subscribe(() => {
                if (this.tabList) {
                    this.tabList.forEach((tab: UiTabComponent) => this.registerTab(tab));
                }
                this.updateTabs();
            });
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    public setActiveTab(activeTab: UiTabComponent) {
        this.tabList.forEach((tab: UiTabComponent, index: number) => {
            if (tab === activeTab) {
                this.activeTab = index;
            } else {
                tab.active = false;
            }
        });
        setTimeout(this.cd.markForCheck.bind(this.cd));
        this.activeTabChange.emit(this.activeTab);
    }

    private updateTabs() {
        if (this.tabList) {
            this.tabList.forEach((tab: UiTabComponent, index: number) => {
                tab.active = index === this.activeTab;
            });
            setTimeout(this.cd.markForCheck.bind(this.cd));
        }
    }

    private registerTab(tab: UiTabComponent) {
        tab.setTabGroup(this);
    }

}
