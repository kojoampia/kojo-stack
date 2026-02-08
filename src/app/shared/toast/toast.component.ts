import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type ToastType = 'info' | 'error' | 'success' | 'warning';

export interface ToastData {
  closable?: boolean;
  message?: string;
  title?: string;
  type: ToastType;
  icon?: string;
  action?: {
    label: string;
    callback: () => void;
  };
}

const TOAST_ICONS: Record<ToastType, string> = {
  info: 'fa-circle-info',
  error: 'fa-circle-exclamation',
  success: 'fa-circle-check',
  warning: 'fa-triangle-exclamation'
};

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  info: {
    bg: 'bg-blue-900/30',
    border: 'border-blue-700',
    text: 'text-blue-300',
    icon: 'text-blue-400'
  },
  error: {
    bg: 'bg-red-900/30',
    border: 'border-red-700',
    text: 'text-red-300',
    icon: 'text-red-400'
  },
  success: {
    bg: 'bg-green-900/30',
    border: 'border-green-700',
    text: 'text-green-300',
    icon: 'text-green-400'
  },
  warning: {
    bg: 'bg-amber-900/30',
    border: 'border-amber-700',
    text: 'text-amber-300',
    icon: 'text-amber-400'
  }
};

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    @if (data()) {
      <div class="flex items-start gap-3 p-4 rounded-lg border animate-in slide-in-from-top-2 duration-300"
           [class]="containerClasses()">
        <!-- Icon -->
        <div [class]="iconClasses()">
          <i class="fas" [class]="iconName()"></i>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          @if (data().title) {
            <div class="font-semibold text-sm mb-1" [class]="textClasses()">
              {{ data().title }}
            </div>
          }
          @if (data().message) {
            <div class="text-sm opacity-90 break-words" [class]="textClasses()">
              {{ data().message }}
            </div>
          }
          @if (data().action) {
            <button 
              (click)="handleAction()"
              class="mt-2 text-xs font-semibold underline hover:no-underline transition-all"
              [class]="textClasses()">
              {{ data().action!.label }}
            </button>
          }
        </div>
        
        <!-- Close Button -->
        @if (isClosable()) {
          <button 
            (click)="close()"
            class="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
            [class]="textClasses()"
            aria-label="Close notification">
            <i class="fas fa-xmark text-sm"></i>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ToastComponent {
  private readonly snackBarRef = inject(MatSnackBarRef<ToastComponent>);
  private readonly injectedData = inject<ToastData>(MAT_SNACK_BAR_DATA);

  readonly data = signal<ToastData>(this.injectedData);
  
  readonly isClosable = computed(() => this.data().closable !== false);
  
  readonly iconName = computed(() => {
    const customIcon = this.data().icon;
    if (customIcon) return customIcon;
    return TOAST_ICONS[this.data().type];
  });

  readonly containerClasses = computed(() => {
    const colors = TOAST_COLORS[this.data().type];
    return `${colors.bg} ${colors.border}`;
  });

  readonly textClasses = computed(() => {
    return TOAST_COLORS[this.data().type].text;
  });

  readonly iconClasses = computed(() => {
    return `${TOAST_COLORS[this.data().type].icon} text-lg`;
  });

  close(): void {
    this.snackBarRef.dismiss();
  }

  handleAction(): void {
    this.data().action?.callback();
    this.close();
  }
}
