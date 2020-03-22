import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

export type SortTypes = 'rating' | 'year';

interface SortTypeItem {
    type: SortTypes;
    title: string;
}

@Component({
    selector: 'nc-movie-sort',
    templateUrl: './movie-sort.component.html',
    styleUrls: ['./movie-sort.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieSortComponent {

    @Input() sort: SortTypes = 'rating';

    @Output() sortChange = new EventEmitter<SortTypes>();

    sortTypes: Array<SortTypeItem> = [
        {
            type: 'rating',
            title: 'Rating'
        },
        {
            type: 'year',
            title: 'Year'
        }
    ]

    onTypeChange() {
        this.sortChange.emit(this.sort)
    }
}
