import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { User } from '../model/user.entity';
import { environment } from '../../../environments/environment';
import { EventBusService } from '../../shared/services/event-bus.service';
import { AccountRegisteredEvent } from '../../shared/events/account-registered.event';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {
  constructor(private eventBus: EventBusService) {
    super();
    this.resourceEndpoint = environment.usersResourceEndpointPath;

    // Listener para crear un User cuando se registre una cuenta
    this.eventBus.on<AccountRegisteredEvent>('AccountRegistered').subscribe(event => {
      if (!event || !event.accountId || !event.role) return;
      const user: Partial<User> = { accountId: event.accountId };
      if (event.role === 'customer') {
        user.customerId = undefined; // Se creará después en el flujo de customer
      } else if (event.role === 'worker') {
        user.workerId = undefined; // Se creará después en el flujo de worker
      }
      this.create(user).subscribe();
    });
  }
} 