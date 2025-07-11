import { Customer } from '../model/customer.entity';
import { CustomerResource, TopHeadlines } from './top-headlines.response';

export class CustomerAssembler {
  static toEntityFromResource(resource: CustomerResource): Customer {
    return new Customer(resource);
  }

  static toEntitiesFromResponse(response: TopHeadlines<CustomerResource>): Customer[] {
    return response.map((customer) => this.toEntityFromResource(customer));
  }
} 