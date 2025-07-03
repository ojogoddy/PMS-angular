import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-property-filters',
    templateUrl: './property-filters.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class PropertyFiltersComponent {
    @Input() searchTerm: string = '';
    @Input() typeFilter: string = 'all';
    @Input() locationFilter: string = 'all';
    @Input() sortBy: string = 'name';
    @Input() locations: string[] = [];
    @Output() searchChange = new EventEmitter<string>();
    @Output() typeFilterChange = new EventEmitter<string>();
    @Output() locationFilterChange = new EventEmitter<string>();
    @Output() sortChange = new EventEmitter<string>();
    @Output() exportCSV = new EventEmitter<void>();
}