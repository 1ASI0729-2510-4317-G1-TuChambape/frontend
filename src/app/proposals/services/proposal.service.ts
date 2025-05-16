import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { environment } from '../../../environments/environment.development';
import { Proposal } from '../model/proposal.entity';

const offersResourceEndpointPath = environment.proposalsResourceEndpointPath;

@Injectable({
  providedIn: 'root',
})
export class ProposalService extends BaseService<Proposal> {
  constructor() {
    super();

    this.resourceEndpoint = offersResourceEndpointPath;
  }
}
