import { ProposalResource } from '../../proposals/services/top-headlines.response';
import { OfferProposalDto } from '../model/offer-proposal.dto';
import { Worker } from '../../users/model/worker.entity';

export class OfferProposalAssembler {
  static toDtoFromResource(resource: ProposalResource, worker: Worker | null): OfferProposalDto {
    return {
      id: resource.id,
      workerId: resource.workerId,
      workerName: worker ? `${worker.firstName} ${worker.lastName}` : 'Desconocido',
      workerAvatar: worker?.avatar || 'assets/img/default-tech.png',
      message: resource.message,
      price: resource.price,
      createdAt: new Date(resource.createdAt),
    };
  }
} 