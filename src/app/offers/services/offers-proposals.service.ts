import { Injectable } from '@angular/core';
import { ProposalService } from '../../proposals/services/proposal.service';
import { WorkerService } from '../../users/services/worker.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OfferProposalDto } from '../model/offer-proposal.dto';
import { OfferProposalAssembler } from './offer-proposal.assembler';

@Injectable({ providedIn: 'root' })
export class OffersProposalsService {
  constructor(
    private proposalService: ProposalService,
    private workerService: WorkerService
  ) { }

  getProposalsForOffer(offerId: number): Observable<OfferProposalDto[]> {
    return this.proposalService.getProposalsByOffer(offerId).pipe(
      switchMap(proposals => {
        if (!proposals.length) return of([]);
        return forkJoin(
          proposals.map(proposal =>
            this.workerService.getById(proposal.workerId).pipe(
              map(worker => ({
                id: proposal.id,
                workerId: proposal.workerId,
                workerName: worker ? `${worker.firstName} ${worker.lastName}` : 'Desconocido',
                workerAvatar: worker?.avatar || 'assets/img/default-tech.png',
                message: proposal.message,
                price: proposal.price,
                createdAt: proposal.createdAt,
              } as OfferProposalDto))
            )
          )
        );
      })
    );
  }

  getProposalForId(id: number): Observable<OfferProposalDto> {
    return this.proposalService.getById(id).pipe(
      switchMap(proposal => {
        // Usamos switchMap para obtener el worker y ensamblar el DTO
        return this.workerService.getById(proposal.workerId).pipe(
          map(worker => OfferProposalAssembler.toDtoFromResource(proposal, worker))
        );
      })
    );
  }
} 