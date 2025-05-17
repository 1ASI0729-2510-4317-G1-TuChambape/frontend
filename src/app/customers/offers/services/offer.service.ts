import { Injectable } from '@angular/core';
import { Offer } from '../model/offer.entity';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';

const offersResourceEndpointPath = environment.offersResourceEndpointPath;

@Injectable({
  providedIn: 'root',
})
export class OfferService extends BaseService<Offer> {
  constructor() {
    super();

    this.resourceEndpoint = offersResourceEndpointPath;
  }

  getAllByUserId(userId: string) {
    return this.search({
      userId: userId,
    });
  }
}
