import { inject, Injectable, signal, computed, Component } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

/**
 * Standalone loading spinner component
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center gap-4">
      <div class="relative">
        <div class="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
      <span class="text-sm text-slate-400 font-medium animate-pulse">Loading...</span>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class LoadingSpinnerComponent {}

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;
  private loadingCount = signal(0);

  /**
   * Whether the loading overlay is currently visible
   */
  readonly isLoading = computed(() => this.loadingCount() > 0);

  /**
   * Show the loading overlay
   * Supports nested calls - overlay stays visible until all hide() calls match show() calls
   */
  show(): void {
    this.loadingCount.update(count => count + 1);
    
    if (this.loadingCount() === 1) {
      this.createOverlay();
    }
  }

  /**
   * Hide the loading overlay
   * Only actually hides when all nested show() calls have been matched with hide()
   */
  hide(): void {
    this.loadingCount.update(count => Math.max(0, count - 1));
    
    if (this.loadingCount() === 0) {
      this.destroyOverlay();
    }
  }

  /**
   * Force hide the loading overlay regardless of nested calls
   */
  forceHide(): void {
    this.loadingCount.set(0);
    this.destroyOverlay();
  }

  private createOverlay(): void {
    if (this.overlayRef) {
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: ['bg-slate-900/80', 'backdrop-blur-sm'],
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    this.overlayRef.attach(new ComponentPortal(LoadingSpinnerComponent));
  }

  private destroyOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
