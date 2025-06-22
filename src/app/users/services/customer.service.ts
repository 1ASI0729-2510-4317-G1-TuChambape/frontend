import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Customer } from '../model/customer.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseService<Customer> {
  constructor() {
    super();
    this.resourceEndpoint = environment.customersResourceEndpointPath;
  }
} 