import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser: User | null = null;

    constructor(private storageService: StorageService) { }

    login(username: string, password: string): boolean {
        const users = this.storageService.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser(): User | null {
        if (!this.currentUser) {
            const user = localStorage.getItem('currentUser');
            this.currentUser = user ? JSON.parse(user) : null;
        }
        return this.currentUser;
    }

    isAdmin(): boolean {
        return this.getCurrentUser()?.role === 'Admin';
    }

    initializeDefaultUsers(): void {
        const users = this.storageService.getUsers();
        if (users.length === 0) {
            const defaultUsers: User[] = [
                { username: 'admin', password: 'admin123', role: 'Admin' },
                { username: 'user', password: 'user123', role: 'Regular' }
            ];
            this.storageService.saveUsers(defaultUsers);
        }
    }
}