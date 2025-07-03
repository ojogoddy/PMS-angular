import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    @Input() user: any;
    dropdownOpen = false;

    constructor
        (private router: Router,
        private authService: AuthService,
    ) { }
    
    toggleDropdown(): void {
        this.dropdownOpen = !this.dropdownOpen;
    }

    closeDropdown(): void {
        this.dropdownOpen = false;
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.closeDropdown()
      }

}