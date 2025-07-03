import { Component, OnInit } from '@angular/core';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { PropertyFormComponent } from '../property-form/property-form.component';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { PropertyFiltersComponent } from '../property-filters/property-filters.component';
import { ToastrModule } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { NavbarComponent } from '../navbar/navbar.component';
import { AnalyticsCardComponent } from '../analytics-card/analytics-card.component';

@Component({
    selector: 'app-property-dashboard',
    templateUrl: './property-dashboard.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        PropertyCardComponent,
        PropertyFiltersComponent,
        PropertyFormComponent,
        NavbarComponent,
        AnalyticsCardComponent,
        ToastrModule
    ]
})
export class PropertyDashboardComponent implements OnInit {
    properties: Property[] = [];
    filteredAndSortedProperties: Property[] = [];
    paginatedProperties: Property[] = [];
    searchTerm = '';
    typeFilter = 'all';
    locationFilter = 'all';
    sortBy = 'name';
    currentPage = 1;
    itemsPerPage = 6;
    showPropertyForm = false;
    selectedProperty: Property | null = null;
    dropdownOpen = false;
    analytics = {
        totalProperties: 0,
        averagePrice: 0,
        totalValue: 0,
        uniqueLocations: 0
    };
    modalOpen = false;
    propertyToDelete: string | null = null;

    constructor(
        private propertyService: PropertyService,
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadProperties();
    }
    toggleDropdown(): void {
        this.dropdownOpen = !this.dropdownOpen;
    }   
    closeDropdown(): void {
        this.dropdownOpen = false;
    }

    get uniqueLocations(): string[] {
        return [...new Set(this.properties.map(p => p.location))];
    }

    get totalPages(): number {
        return Math.ceil(this.filteredAndSortedProperties.length / this.itemsPerPage);
    }

    get totalPagesArray(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    updateAnalytics(): void {
        const props = this.filteredAndSortedProperties || [];
        this.analytics.totalProperties = props.length;
        this.analytics.totalValue = props.reduce((sum, p) => sum + (p.price || 0), 0);
        this.analytics.averagePrice = props.length
            ? Math.round(this.analytics.totalValue / props.length)
            : 0;
        this.analytics.uniqueLocations = new Set(props.map(p => p.location)).size;
    }
    analyticsCards = [
        {
            title: 'Total Properties',
            value: () => this.analytics.totalProperties,
            subtitle: 'Properties in portfolio',
            iconColorClass: 'text-blue-600'
        },
        {
            title: 'Average Price',
            value: () => '₦' + (this.analytics.averagePrice | 0).toLocaleString(),
            subtitle: 'Per month average',
            iconColorClass: 'text-green-600'
        },
        {
            title: 'Total Value',
            value: () => '₦' + (this.analytics.totalValue | 0).toLocaleString(),
            subtitle: 'Portfolio value',
            iconColorClass: 'text-purple-600'
        },
        {
            title: 'Locations',
            value: () => this.analytics.uniqueLocations,
            subtitle: 'Unique locations',
            iconColorClass: 'text-orange-600'
        }
      ];

    loadProperties(): void {
        this.propertyService.getAllProperties().subscribe(properties => {
            this.properties = properties;
            this.updateFilteredAndSortedProperties();
        });
    }

    openPropertyForm(property?: Property): void {
        this.selectedProperty = property || null;
        this.showPropertyForm = true;
    }

    closePropertyForm(): void {
        this.showPropertyForm = false;
        this.selectedProperty = null;
    }
    saved() {
        this.closePropertyForm();
        this.loadProperties()
    }

    onFormSubmit(result: Property): void {
        if (this.selectedProperty) {
            // Edit mode
            this.propertyService.updateProperty(this.selectedProperty.id, result).subscribe(updated => {
                // this.properties = this.properties.map(p => p.id === this.selectedProperty?.id ? updated : p);
                this.closePropertyForm();
                this.loadProperties()
                this.toastr.success('Property updated successfully', 'Success');
                // this.updateFilteredAndSortedProperties();
               
            });
        } else {
            // Create mode
            this.propertyService.createProperty(result).subscribe(newProperty => {
                // this.properties = [...this.properties, newProperty];
                this.closePropertyForm();
                this.loadProperties()
                this.toastr.success('Property created successfully', 'Success');
                // this.updateFilteredAndSortedProperties();
                
                
            });
        }
    }
    

    updateFilteredAndSortedProperties(): void {
        let filtered = this.properties;

        // Search filter
        if (this.searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                p.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Type filter
        if (this.typeFilter !== 'all') {
            filtered = filtered.filter(p => p.type === this.typeFilter);
        }

        // Location filter
        if (this.locationFilter !== 'all') {
            filtered = filtered.filter(p => p.location === this.locationFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'location':
                    return a.location.localeCompare(b.location);
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        this.filteredAndSortedProperties = filtered;
        this.updatePaginatedProperties();
        this.updateAnalytics();
    }

    updatePaginatedProperties(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.paginatedProperties = this.filteredAndSortedProperties.slice(startIndex, startIndex + this.itemsPerPage);
    }

    onSearchChange(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.updateFilteredAndSortedProperties();
    }

    onTypeFilterChange(type: string): void {
        this.typeFilter = type;
        this.currentPage = 1;
        this.updateFilteredAndSortedProperties();
    }

    onLocationFilterChange(location: string): void {
        this.locationFilter = location;
        this.currentPage = 1;
        this.updateFilteredAndSortedProperties();
    }

    onSortChange(sortBy: string): void {
        this.sortBy = sortBy;
        this.currentPage = 1;
        this.updateFilteredAndSortedProperties();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.updatePaginatedProperties();
    }

    // openPropertyForm(property?: Property): void {
    //     const dialogRef = this.dialog.open(PropertyFormComponent, {
    //         width: '80rem',
    //         maxHeight: '90vh',
    //         panelClass: 'overflow-y-auto',
    //         data: { property }
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             if (property) {
    //                 this.propertyService.updateProperty(property.id, result).subscribe(updated => {
    //                     this.properties = this.properties.map(p => p.id === property.id ? updated : p);
    //                     this.toastr.success('Property updated successfully', 'Success');
    //                     this.updateFilteredAndSortedProperties();
    //                 });
    //             } else {
    //                 this.propertyService.createProperty(result).subscribe(newProperty => {
    //                     this.properties = [...this.properties, newProperty];
    //                     this.toastr.success('Property created successfully', 'Success');
    //                     this.updateFilteredAndSortedProperties();
    //                 });
    //             }
    //         }
    //     });
    // }

    onEditProperty(property: Property): void {
        this.openPropertyForm(property);
    }

    onDeleteProperty(id: string): void {
       this.openDeleteModal(id)
    }
    confirmDelete() {
        if (this.propertyToDelete) {
            this.propertyService.deleteProperty(this.propertyToDelete).subscribe(success => {
                if (success) {
                    this.properties = this.properties.filter(p => p.id !== this.propertyToDelete);
                    this.toastr.success('Property deleted successfully', 'Success');
                    this.updateFilteredAndSortedProperties();
                } else {
                    this.toastr.error('Failed to delete property', 'Error');
                }
                this.closeDeleteModal();
            });
        }
    }
    openDeleteModal(id: string): void {
        this.propertyToDelete = id;
        this.modalOpen = true;
    }
    closeDeleteModal(): void {
        this.modalOpen = false;
        this.propertyToDelete = null;
    }

    onExportCSV(): void {
        const csvContent = this.propertyService.exportToCSV(this.filteredAndSortedProperties);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        saveAs(blob, `properties-${new Date().toISOString().split('T')[0]}.csv`);
        this.toastr.success('Properties exported to CSV successfully', 'Success');
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    get user() {
        return this.authService.getCurrentUser();
    }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }
}