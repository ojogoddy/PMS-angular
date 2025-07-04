import { Injectable } from '@angular/core';
import { Property } from '../models/property.model';
import { Observable, of } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class PropertyService {
    private storageKey = 'properties';

    getAllProperties(): Observable<Property[]> {
        const storageKey = this.storageKey;
        let properties: Property[] = [];
        const data = localStorage.getItem(storageKey);

        // Define mock/sample properties
        const sampleProperties: Property[] = [
            {
                id: '1',
                name: 'Modern Downtown Apartment',
                location: 'Lagos',
                type: 'flat',
                price: 2500,
                bedrooms: 2,
                bathrooms: 2,
                area: 1200,
                description: 'Beautiful modern apartment in the heart of Lagos',
                imageUrl: './home2.jpg',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Spacious Family House',
                location: 'Abuja',
                type: 'duplex',
                price: 3500,
                bedrooms: 4,
                bathrooms: 3,
                area: 2500,
                description: 'Perfect family home with large backyard in Abuja',
                imageUrl: './home1.jpg',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Luxury Condo',
                location: 'Port Harcourt',
                type: 'bungalow',
                price: 4200,
                bedrooms: 3,
                bathrooms: 2,
                area: 1800,
                description: 'Luxury condominium with city views in Port Harcourt',
                imageUrl: './home3.jpg',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '1',
                name: 'Modern Downtown Apartment',
                location: 'Lagos',
                type: 'flat',
                price: 2500,
                bedrooms: 2,
                bathrooms: 2,
                area: 1200,
                description: 'Beautiful modern apartment in the heart of Lagos',
                imageUrl: './home2.jpg',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Spacious Family House',
                location: 'Abuja',
                type: 'duplex',
                price: 3500,
                bedrooms: 4,
                bathrooms: 3,
                area: 2500,
                description: 'Perfect family home with large backyard in Abuja',
                imageUrl: './home1.jpg',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Luxury Condo',
                location: 'Port Harcourt',
                type: 'bungalow',
                price: 4200,
                bedrooms: 3,
                bathrooms: 2,
                area: 1800,
                description: 'Luxury condominium with city views in Port Harcourt',
                imageUrl: './home3.jpg',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '1',
                name: 'Modern Downtown Apartment',
                location: 'Lagos',
                type: 'flat',
                price: 2500,
                bedrooms: 2,
                bathrooms: 2,
                area: 1200,
                description: 'Beautiful modern apartment in the heart of Lagos',
                imageUrl: './home2.jpg',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Spacious Family House',
                location: 'Abuja',
                type: 'duplex',
                price: 3500,
                bedrooms: 4,
                bathrooms: 3,
                area: 2500,
                description: 'Perfect family home with large backyard in Abuja',
                imageUrl: './home1.jpg',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Luxury Condo',
                location: 'Port Harcourt',
                type: 'bungalow',
                price: 4200,
                bedrooms: 3,
                bathrooms: 2,
                area: 1800,
                description: 'Luxury condominium with city views in Port Harcourt',
                imageUrl: './home3.jpg',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
        ];

        if (!data) {
            // If no data, initialize with sample data
            localStorage.setItem(storageKey, JSON.stringify(sampleProperties));
            properties = sampleProperties;
        } else {
            properties = JSON.parse(data);

            // Add sample properties if not already present (avoid duplicates by id)
            sampleProperties.forEach(sample => {
                if (!properties.some(p => p.id === sample.id)) {
                    properties.push(sample);
                }
            });

            // Save back to localStorage if any new sample was added
            localStorage.setItem(storageKey, JSON.stringify(properties));
        }

        return of(properties);
    }

    createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Observable<Property> {
        const properties = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const newProperty: Property = {
            ...property,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        properties.push(newProperty);
        localStorage.setItem(this.storageKey, JSON.stringify(properties));
        return of(newProperty);
    }

    updateProperty(id: string, property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Observable<Property> {
        const properties = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const index = properties.findIndex((p: Property) => p.id === id);
        if (index !== -1) {
            const updatedProperty: Property = {
                ...properties[index],
                ...property,
                updatedAt: new Date().toISOString()
            };
            properties[index] = updatedProperty;
            localStorage.setItem(this.storageKey, JSON.stringify(properties));
            return of(updatedProperty);
        }
        return of();
    }

    deleteProperty(id: string): Observable<boolean> {
        const properties = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const filtered = properties.filter((p: Property) => p.id !== id);
        if (filtered.length < properties.length) {
            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            return of(true);
        }
        return of(false);
    }

    exportToCSV(properties: Property[]): string {
        const headers = ['ID,Name,Location,Type,Price,Bedrooms,Bathrooms,Area,Description,Image URL,Created At,Updated At'];
        const rows = properties.map(p =>
            `${p.id},${p.name},${p.location},${p.type},${p.price},${p.bedrooms},${p.bathrooms},${p.area},${p.description || ''},${p.imageUrl || ''},${p.createdAt},${p.updatedAt}`
        );
        return headers.concat(rows).join('\n');
    }
}