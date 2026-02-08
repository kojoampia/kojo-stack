import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateStorageService {
  private readonly previousUrlKey = 'previousUrl';

  storeUrl(url: string): void {
    sessionStorage.setItem(this.previousUrlKey, url);
  }

  getUrl(): string | null {
    return sessionStorage.getItem(this.previousUrlKey);
  }

  clearUrl(): void {
    sessionStorage.removeItem(this.previousUrlKey);
  }
}
