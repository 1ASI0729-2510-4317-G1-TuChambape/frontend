import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
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

  constructor(private sessionManager: SessionManagerService, private router: Router) {
    // Initialize the payment event handler service
    const paymentEventHandler = inject(PaymentEventHandlerService);
    // The service will be instantiated and event listeners will be set up

    // --- Lógica de limpieza y redirección forzada ---
    const sessionData = localStorage.getItem('jobconnect_session');
    const userData = localStorage.getItem('jobconnect_user');
    let mustClean = false;
    if (!sessionData || !userData) {
      mustClean = true;
    } else {
      try {
        const session = JSON.parse(sessionData);
        const user = JSON.parse(userData);
        if (!session.account || !session.account.id || !session.account.email) {
          mustClean = true;
        } else if ((session.account.role === 'customer' && !user.customerId) || (session.account.role === 'worker' && !user.workerId)) {
          mustClean = true;
        }
      } catch {
        mustClean = true;
      }
    }
    if (mustClean) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
