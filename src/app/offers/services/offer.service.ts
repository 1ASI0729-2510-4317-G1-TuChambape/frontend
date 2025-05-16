import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Offer } from '../model/offer.entity';
import { environment } from '../../../environments/environment.development';

const offersResourceEndpointPath = environment.offersResourceEndpointPath;

@Injectable({
  providedIn: 'root',
})
export class OfferService extends BaseService<Offer> {
  constructor() {
    super();

    this.resourceEndpoint = offersResourceEndpointPath;
  }
}
