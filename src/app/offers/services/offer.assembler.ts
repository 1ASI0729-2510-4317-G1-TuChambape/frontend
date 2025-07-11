import { Offer } from '../model/offer.entity';
import { OfferResource, TopHeadlines } from './top-headlines.response';

export class OfferAssembler {
  static toEntityFromResource(resource: OfferResource): Offer {
    return new Offer(resource);
  }

  static toEntitiesFromResponse(response: TopHeadlines): Offer[] {
    return response.map((offer) => this.toEntityFromResource(offer));
  }
}
