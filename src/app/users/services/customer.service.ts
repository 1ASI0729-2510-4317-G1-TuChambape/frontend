import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseService } from '../../shared/services/base.service';
import { Customer } from '../model/customer.entity';
import { environment } from '../../../environments/environment';
import { EventBusService } from '../../shared/services/event-bus.service';
import { Preferences } from '../model/preferences.entity';
import { PreferredAvailability } from './top-headlines.response';
import { PreferencesService } from './preferences.service';

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseService<Customer> {
  constructor(
    private eventBus: EventBusService,
    private preferencesService: PreferencesService
  ) {
    super();
    this.resourceEndpoint = environment.customersResourceEndpointPath;
  }

  createCustomer(customerData: Omit<Customer, 'id'>): Observable<Customer> {
    return this.create(customerData).pipe(
      switchMap(customer => {
        // Crear preferencias por defecto
        const preferences = new Preferences({
          id: 0,
          customerId: customer.id,
          preferredCategory: '',
          preferredLocation: '',
          preferredServiceType: '',
          preferredExperienceYears: [''],
          preferredAvailability: PreferredAvailability.Immediate,
          minAcceptableRating: 0,
          estimatedBudgetRange: { min: 0, max: 0 },
          languages: ['spanish']
        });
        return this.preferencesService.create(preferences).pipe(
          map(() => customer)
        );
      })
    );
  }
} 