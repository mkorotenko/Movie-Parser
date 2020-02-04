import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTabGroupComponent } from './ui-tab-group.component';

describe('UiTabGroupComponent', () => {
    let component: UiTabGroupComponent;
    let fixture: ComponentFixture<UiTabGroupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UiTabGroupComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UiTabGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
