import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Login } from './login.model';
import { AccountService } from '../auth/account.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { Account } from './account.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly accountService = inject(AccountService);
  private readonly authServerProvider = inject(AuthServerProvider);

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials)
                .pipe(
                  mergeMap(() => this.accountService.identity(true))
                );
                
    ;
  }

  logout(): void {
    this.authServerProvider.logout().subscribe({
      next: () => {
        this.accountService.authenticate(null);
      },
      error: () => {
        this.accountService.authenticate(null);
      }
    });
  }
}
