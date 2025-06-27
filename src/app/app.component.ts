import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SessionManagerService } from './iam/services/session-manager.service';
import { SessionIndicatorComponent } from './iam/components/session-indicator/session-indicator.component';
import { PaymentEventHandlerService } from './payments/services/payment-event-handler.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SessionIndicatorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jobconnect-frontend';

  constructor(private sessionManager: SessionManagerService) {
    // Initialize the payment event handler service
    const paymentEventHandler = inject(PaymentEventHandlerService);
    // The service will be instantiated and event listeners will be set up
  }
}
