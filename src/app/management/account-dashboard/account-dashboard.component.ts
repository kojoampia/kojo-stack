import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from '@core/auth/account.service';
import { Account } from '@core/login/account.model';

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-account-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountDashboardComponent implements OnInit, OnDestroy {
  private readonly accountService = inject(AccountService);
  private readonly destroy$ = new Subject<void>();

  account = signal<Account | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  showPasswordForm = signal(false);
  passwordChanging = signal(false);

  passwordData: PasswordChange = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  passwordError = signal<string | null>(null);
  passwordSuccess = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAccount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAccount(): void {
    this.loading.set(true);
    this.error.set(null);
    this.accountService.identity(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (account) => {
          this.account.set(account);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load account details');
          this.loading.set(false);
        }
      });
  }

  togglePasswordForm(): void {
    this.showPasswordForm.update(v => !v);
    this.resetPasswordForm();
  }

  changePassword(): void {
    this.passwordError.set(null);
    this.passwordSuccess.set(null);

    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.passwordError.set('All password fields are required');
      return;
    }

    if (this.passwordData.newPassword.length < 8) {
      this.passwordError.set('New password must be at least 8 characters');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.passwordError.set('New password and confirmation do not match');
      return;
    }

    this.passwordChanging.set(true);
    this.accountService.changePassword(this.passwordData.currentPassword, this.passwordData.newPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.passwordSuccess.set('Password changed successfully');
          this.passwordChanging.set(false);
          this.resetPasswordForm();
        },
        error: (err) => {
          if (err.status === 400) {
            this.passwordError.set('Current password is incorrect');
          } else {
            this.passwordError.set('Failed to change password. Please try again.');
          }
          this.passwordChanging.set(false);
        }
      });
  }

  cancelPasswordChange(): void {
    this.showPasswordForm.set(false);
    this.resetPasswordForm();
  }

  private resetPasswordForm(): void {
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.passwordError.set(null);
    this.passwordSuccess.set(null);
  }
}
