import { ProposalResource } from './top-headlines.response';
import { Proposal } from '../model/proposal.entity';

export class ProposalAssembler {
  static toEntityFromResource(resource: ProposalResource): Proposal {
    return new Proposal(resource);
  }

  static toEntitiesFromResponse(response: ProposalResource[]): Proposal[] {
    return response.map(r => this.toEntityFromResource(r));
  }
} 