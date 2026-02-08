import { Component, signal, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '@app/core/services';
import { ConsultingInquiry } from '@app/core/models';
import { ProjectType } from '@app/core/models/project.model';

declare var paypal: any;

@Component({
  selector: 'app-hire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hire.component.html',
  styleUrls: ['./hire.component.scss']
})
export class HireComponent implements OnInit, AfterViewChecked {
  @ViewChild('paypalButtonContainer') paypalButtonContainer!: ElementRef;

  inquiry: ConsultingInquiry = {
    name: '',
    email: '',
    type: 'Architecture',
    message: ''
  };

  engagementTypes: ProjectType[] = ['Architecture', 'DevOps', 'Migration'];
  highLoad = signal(true);

  // Payment flow state
  paymentCompleted = signal(false);
  paymentInProgress = signal(false);
  paymentError = signal<string | null>(null);
  transactionId = signal<string | null>(null);
  showPaymentStep = signal(false);
  paypalButtonRendered = false;

  // PayPal configuration
  readonly PAYPAL_ACCOUNT = 'kojo.ampia@jojoaddison.net';
  readonly INQUIRY_FEE = 1.99;
  readonly CURRENCY = 'EUR';
  readonly PAYPAL_CLIENT_ID ='BAAr8DEr2oEc4llQN9V0Hx9Tar2Ky-ApFeCm8k7vH1Risbw83C3k2VAuaopVxi1Pjdun_0jzFOHVxN1ttk';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadPayPalScript();
  }

  ngAfterViewChecked(): void {
    if (this.showPaymentStep() && this.paypalButtonContainer && !this.paypalButtonRendered) {
      this.renderPayPalButton();
    }
  }

  private loadPayPalScript(): void {
    if (document.getElementById('paypal-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-script';
    script.src = `https://www.paypal.com/sdk/js?client-id=${this.PAYPAL_CLIENT_ID}&disable-funding=venmo&currency=${this.CURRENCY}`;
    script.onload = () => {
      console.log('PayPal SDK loaded');
    };
    document.body.appendChild(script);
  }

  private renderPayPalButton(): void {
    if (typeof paypal === 'undefined' || !this.paypalButtonContainer?.nativeElement) {
      return;
    }

    this.paypalButtonRendered = true;
    this.paypalButtonContainer.nativeElement.innerHTML = '';

    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay'
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            description: 'Consulting Inquiry Fee',
            amount: {
              currency_code: this.CURRENCY,
              value: this.INQUIRY_FEE.toFixed(2)
            },
            payee: {
              email_address: this.PAYPAL_ACCOUNT
            }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        this.paymentInProgress.set(true);
        this.paymentError.set(null);
        
        try {
          const order = await actions.order.capture();
          this.transactionId.set(order.id);
          this.paymentCompleted.set(true);
          this.paymentInProgress.set(false);
          console.log('Payment successful:', order);
        } catch (error) {
          this.paymentError.set('Payment capture failed. Please try again.');
          this.paymentInProgress.set(false);
          console.error('Payment error:', error);
        }
      },
      onError: (err: any) => {
        this.paymentError.set('Payment failed. Please try again.');
        this.paymentInProgress.set(false);
        console.error('PayPal error:', err);
      },
      onCancel: () => {
        this.paymentError.set('Payment was cancelled.');
        this.paymentInProgress.set(false);
      }
    }).render(this.paypalButtonContainer.nativeElement);
  }

  isFormValid(): boolean {
    return !!(this.inquiry.name?.trim() && 
              this.inquiry.email?.trim() && 
              this.inquiry.type && 
              this.inquiry.message?.trim());
  }

  proceedToPayment(): void {
    if (!this.isFormValid()) {
      this.paymentError.set('Please fill in all required fields before proceeding to payment.');
      return;
    }
    this.paymentError.set(null);
    this.showPaymentStep.set(true);
    this.paypalButtonRendered = false;
  }

  cancelPayment(): void {
    this.showPaymentStep.set(false);
    this.paymentError.set(null);
    this.paypalButtonRendered = false;
  }

  selectEngagementType(type: string): void {
    this.inquiry.type = type as ProjectType;
  }

  submitInquiry(): void {
    if (!this.paymentCompleted()) {
      this.paymentError.set('Payment is required before submitting your inquiry.');
      return;
    }

    const newProject = {
      name: `${this.inquiry.type} Strategy`,
      client: this.inquiry.name,
      type: this.inquiry.type,
      description: this.inquiry.message,
      stack: ['Planning', 'TBD'],
      status: 'Pending' as const,
      architecture: 'Under Review',
      paymentTransactionId: this.transactionId()
    };

    this.projectService.addProject(newProject);
    
    alert(`Contract Initialized for ${this.inquiry.name}. Deployment pipeline started. Transaction ID: ${this.transactionId()}`);

    // Reset form and payment state
    this.inquiry = {
      name: '',
      email: '',
      type: 'Architecture',
      message: ''
    };
    this.paymentCompleted.set(false);
    this.transactionId.set(null);
    this.showPaymentStep.set(false);
    this.paypalButtonRendered = false;
  }
}
