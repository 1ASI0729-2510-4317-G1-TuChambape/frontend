import { ProposalResource, ProposalStatus } from "../services/top-headlines.response";

export class Proposal {
  id: number;
  offerId: number;
  workerId: number;
  message: string;
  price: number;
  createdAt: Date;
  status: ProposalStatus;

  constructor(params: ProposalResource) {
    this.id = params.id;
    this.offerId = params.offerId;
    this.workerId = params.workerId;
    this.message = params.message;
    this.price = params.price;
    this.createdAt = new Date(params.createdAt);
    this.status = params.status;
  }
} 