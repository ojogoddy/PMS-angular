import { Injectable } from '@angular/core';
import { Property } from '../models/property.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly PROPERTIES_KEY = 'properties';
    private readonly USERS_KEY = 'users';

    constructor() { }

    // Property methods
    getProperties(): Property[] {
        const data = localStorage.getItem(this.PROPERTIES_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveProperties(properties: Property[]): void {
        localStorage.setItem(this.PROPERTIES_KEY, JSON.stringify(properties));
    }

    // User methods
    getUsers(): User[] {
        const data = localStorage.getItem(this.USERS_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveUsers(users: User[]): void {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
}