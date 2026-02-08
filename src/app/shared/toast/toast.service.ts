import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { ToastComponent, ToastData, ToastType } from './toast.component';

export interface ToastOptions extends Partial<ToastData> {
  duration?: number;
  position?: 'top' | 'bottom';
  horizontalPosition?: 'start' | 'center' | 'end';
}

const DEFAULT_DURATION = 5000;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);
  private activeToast = signal<MatSnackBarRef<ToastComponent> | null>(null);

  /**
   * Show a toast notification
   */
  show(data: ToastData, options?: Omit<ToastOptions, keyof ToastData>): MatSnackBarRef<ToastComponent> {
    const config: MatSnackBarConfig = {
      data,
      duration: options?.duration ?? DEFAULT_DURATION,
      verticalPosition: options?.position ?? 'top',
      horizontalPosition: options?.horizontalPosition ?? 'end',
      panelClass: ['toast-panel', `toast-${data.type}`],
    };

    const ref = this.snackBar.openFromComponent(ToastComponent, config);
    this.activeToast.set(ref);
    
    ref.afterDismissed().subscribe(() => {
      if (this.activeToast() === ref) {
        this.activeToast.set(null);
      }
    });

    return ref;
  }

  /**
   * Show a success toast
   */
  success(message: string, title?: string, options?: Omit<ToastOptions, 'message' | 'title' | 'type'>): MatSnackBarRef<ToastComponent> {
    return this.show({ message, title, type: 'success', ...options });
  }

  /**
   * Show an error toast
   */
  error(message: string, title?: string, options?: Omit<ToastOptions, 'message' | 'title' | 'type'>): MatSnackBarRef<ToastComponent> {
    return this.show({ message, title, type: 'error', duration: 0, closable: true, ...options });
  }

  /**
   * Show an info toast
   */
  info(message: string, title?: string, options?: Omit<ToastOptions, 'message' | 'title' | 'type'>): MatSnackBarRef<ToastComponent> {
    return this.show({ message, title, type: 'info', ...options });
  }

  /**
   * Show a warning toast
   */
  warning(message: string, title?: string, options?: Omit<ToastOptions, 'message' | 'title' | 'type'>): MatSnackBarRef<ToastComponent> {
    return this.show({ message, title, type: 'warning', ...options });
  }

  /**
   * Show a toast with an action button
   */
  withAction(
    message: string, 
    actionLabel: string, 
    actionCallback: () => void,
    type: ToastType = 'info',
    options?: Omit<ToastOptions, 'message' | 'type' | 'action'>
  ): MatSnackBarRef<ToastComponent> {
    return this.show({
      message,
      type,
      action: { label: actionLabel, callback: actionCallback },
      closable: true,
      ...options
    }, { duration: 0 });
  }

  /**
   * Dismiss the currently active toast
   */
  dismiss(): void {
    this.activeToast()?.dismiss();
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use show(), success(), error(), info(), or warning() instead
   */
  open(data: ToastData, duration?: number): void {
    this.show(data, { duration });
  }
}
