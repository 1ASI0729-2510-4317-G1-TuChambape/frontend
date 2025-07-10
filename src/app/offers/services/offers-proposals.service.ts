import { Injectable } from '@angular/core';
import { ProposalService } from '../../proposals/services/proposal.service';
import { WorkerService } from '../../users/services/worker.service';
import { ReviewService } from './review.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OfferProposalDto } from '../model/offer-proposal.dto';
import { OfferProposalAssembler } from './offer-proposal.assembler';

@Injectable({ providedIn: 'root' })
export class OffersProposalsService {
  constructor(
    private proposalService: ProposalService,
    private workerService: WorkerService,
    private reviewService: ReviewService
  ) { }

  getProposalsForOffer(offerId: number): Observable<OfferProposalDto[]> {
    return this.proposalService.getProposalsByOffer(offerId).pipe(
      switchMap(proposals => {
        if (!proposals.length) return of([]);
        return forkJoin(
          proposals.map(proposal =>
            this.workerService.getById(proposal.workerId).pipe(
              switchMap(worker =>
                this.reviewService.getReviewsByReviewerUserId(worker.id).pipe(
                  map(reviews => {
                    const rating = reviews.length ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
                    const reviewCount = reviews.length;
                    return {
                      ...OfferProposalAssembler.toDtoFromResource(proposal, worker),
                      rating,
                      reviewCount
                    };
                  })
                )
              )
            )
          )
        );
      })
    );
  }

  getProposalForId(id: number): Observable<OfferProposalDto> {
    return this.proposalService.getById(id).pipe(
      switchMap(proposal => {
        return this.workerService.getById(proposal.workerId).pipe(
          switchMap(worker =>
            this.reviewService.getReviewsByReviewerUserId(worker.id).pipe(
              map(reviews => {
                const rating = reviews.length ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
                const reviewCount = reviews.length;
                return {
                  ...OfferProposalAssembler.toDtoFromResource(proposal, worker),
                  rating,
                  reviewCount
                };
              })
            )
          )
        );
      })
    );
  }
} 