import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Proposal } from '../model/proposal.entity';
import { ProposalAssembler } from './proposal.assembler';
import { ProposalResource } from './top-headlines.response';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ProposalService extends BaseService<Proposal> {
  constructor() {
    super();
    this.resourceEndpoint = environment.proposalsResourceEndpointPath;
  }

  getProposalsByOffer(offerId: number): Observable<Proposal[]> {
    return this.search({ offerId }).pipe(
      map((resources) => ProposalAssembler.toEntitiesFromResponse(resources))
    );
  }

  getProposalsByWorker(workerId: number): Observable<Proposal[]> {
    return this.search({ workerId }).pipe(
      map((resources: ProposalResource[]) => ProposalAssembler.toEntitiesFromResponse(resources))
    );
  }

  getProposalById(id: number): Observable<Proposal | null> {
    return this.getById(id).pipe(
      map((resource: ProposalResource | null) => resource ? ProposalAssembler.toEntityFromResource(resource) : null)
    );
  }

  createProposal(proposalData: Omit<Proposal, 'id'>): Observable<Proposal> {
    return this.create({
      id: 0,
      ...proposalData,
    }).pipe(
      map((resource: ProposalResource) => ProposalAssembler.toEntityFromResource(resource))
    );
  }

  updateProposal(id: number, updateData: Partial<Proposal>): Observable<Proposal | null> {
    return this.update(id, updateData).pipe(
      map((resource: ProposalResource | null) => resource ? ProposalAssembler.toEntityFromResource(resource) : null)
    );
  }

  deleteProposal(id: number): Observable<boolean> {
    return this.delete(id);
  }
} 