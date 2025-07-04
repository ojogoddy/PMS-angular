import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, ToastrModule]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    errorMessage: string | null = null;
    showPassword = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        // Initialize default users on component load
        this.authService.initializeDefaultUsers();

        // Redirect to properties if already logged in
        if (this.authService.getCurrentUser()) {
            this.router.navigate(['/properties']);
        }
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;
            const isLoggedIn = this.authService.login(username, password);
            if (isLoggedIn) {
                this.toastr.success('Login successful', 'Welcome!');
                this.router.navigate(['/properties']);
            } else {
                this.toastr.error('Invalid username or password', 'Login Failed');
            }
        }
    }
}