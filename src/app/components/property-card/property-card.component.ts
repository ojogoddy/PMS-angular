import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Property } from '../../models/property.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-property-card',
    templateUrl: './property-card.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class PropertyCardComponent {
    @Input() property!: Property;
    @Output() edit = new EventEmitter<Property>();
    @Output() delete = new EventEmitter<string>();

    constructor(private authService: AuthService) { }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    onEdit(): void {
        this.edit.emit(this.property);
    }

    onDelete(): void {
        this.delete.emit(this.property.id);
    }
}