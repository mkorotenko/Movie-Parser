import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

export type SearchTypes = 'searchText' | 'year' | 'actor' | 'genre';

export interface SearchRequest {
    type: SearchTypes;
    value: any;
}

interface SearchTypeItem {
    type: SearchTypes;
    title: string;
}

@Component({
    selector: 'nc-movie-search',
    templateUrl: './movie-search.component.html',
    styleUrls: ['./movie-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieSearchComponent {

    @Input() searchType: SearchTypes = 'searchText';

    @Input() searchValue: any = '';

    @Output() search = new EventEmitter<SearchRequest>();

    searchTypes: Array<SearchTypeItem> = [
        {
            type: 'searchText',
            title: 'Title'
        },
        {
            type: 'year',
            title: 'Year'
        },
        {
            type: 'actor',
            title: 'Actor'
        },
        {
            type: 'genre',
            title: 'Genre'
        },
    ]

    onTypeChange() {
        this.searchValue = '';
        this.search.emit({
            type: this.searchType,
            value: ''
        })
    }

    onSearch(value: any) {
        this.search.emit({
            type: this.searchType,
            value
        })
    }
}
