import { Routes } from '@angular/router';
import { PropertyFormComponent } from './components/property-form/property-form.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { PropertyDashboardComponent } from './components/property-dashboard/property-dashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'properties', component: PropertyDashboardComponent, canActivate: [AuthGuard], data: { roles: [] } },
    { path: 'add', component: PropertyFormComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
    { path: 'edit/:id', component: PropertyFormComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];