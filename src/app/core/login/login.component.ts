import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  username = '';
  password = '';
  loading = false;
  error: string | null = null;
  showPassword = false;
  returnUrl: string | null = null;
  isLoginError = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly loginService: LoginService,
    private readonly router: Router,
  ) {}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogin(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Please enter both username and password';
      this.isLoginError = true;
      return;
    }

    this.loading = true;
    this.error = null;
    this.isLoginError = false;

    this.loginService.login({ username: this.username, password: this.password, rememberMe: false })
      .subscribe(
        {
        next: () => {
          this.loading = false;
          this.error = null;
          this.isLoginError = false;
          // Navigate to management dashboard or return URL
          this.router.navigateByUrl('/management');
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.isLoginError = true;
          this.password = '';
          this.error = '';
          if (err.status === 401) {
            this.error = 'Invalid username or password';
          } else {
            this.error = 'An error occurred while logging in';
          }
          this.router.navigate(['/login']);
        }
        }
        );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onLogin();
    }
  }

  clearError(): void {
    this.error = null;
    this.isLoginError = false;
  }
}
