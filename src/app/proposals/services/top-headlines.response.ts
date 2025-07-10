export type TopHeadlines = ProposalResource[];

export enum ProposalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  FINISHED = 'FINISHED'
}

export interface ProposalResource {
  id: number;
  offerId: number;
  workerId: number;
  message: string;
  price: number;
  createdAt: string | Date;
  status: ProposalStatus;
} 