import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Offer } from '../model/offer.entity';
import { BaseService } from '../../shared/services/base.service';
import { OfferStatus } from './top-headlines.response';
import { OfferAssembler } from './offer.assembler';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService extends BaseService<Offer> {
  constructor() {
    super();
    this.resourceEndpoint = environment.offersResourceEndpointPath;
  }

  getOffersByClient(clientId: string): Observable<Offer[]> {
    return this.search({
      clientId,
    }).pipe(
      map(offers => OfferAssembler.toEntitiesFromResponse(offers))
    );
  }

  getOffersByStatus(clientId: string, status: OfferStatus): Observable<Offer[]> {
    return this.search({
      clientId,
      status,
    }).pipe(
      map(offers => OfferAssembler.toEntitiesFromResponse(offers))
    );
  }

  getOfferById(id: string): Observable<Offer | null> {
    return this.getById(id).pipe(
      map(offer => offer ? OfferAssembler.toEntityFromResource(offer) : null)
    );
  }

  createOffer(offerData: Omit<Offer, "id">, clientId: number, clientEmail: string): Observable<Offer> {
    const newOffer: Offer = {
      id: 0,
      ...offerData,
      clientId,
      clientEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
      proposalsCount: 0
    };

    return this.create(newOffer).pipe(
      map(offer => OfferAssembler.toEntityFromResource(offer))
    );
  }

  updateOffer(id: string, updateData: Offer): Observable<Offer | null> {
    return this.update(id, updateData).pipe(
      map(offer => offer ? OfferAssembler.toEntityFromResource(offer) : null)
    );
  }

  updateOfferStatus(id: string, status: OfferStatus): Observable<Offer | null> {
    return this.getOfferById(id).pipe(
      switchMap(offer => {
        if (!offer) return of(null);
        return this.updateOffer(id, { ...offer, status });
      }),
      map(offer => offer ? OfferAssembler.toEntityFromResource(offer) : null)
    );
  }

  deleteOffer(id: string): Observable<boolean> {
    return this.delete(id);
  }

  selectProposal(offer: Offer, proposalId: number): Observable<Offer> {
    return this.update(offer.id, { ...offer, status: OfferStatus.PENDING, selectedProposalId: proposalId });
  }
} 