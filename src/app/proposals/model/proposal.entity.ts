export interface ProposalPrimitives {
  uid: string;
  offerUid: string;
  userUid: string;
  coverLetter: string;
  estimatedBudget: number;
  estimatedTimeframe: string;
  portfolioLinks?: string[];
  attachments?: string[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export class Proposal {
  uid: string;
  offerUid: string;
  userUid: string;
  coverLetter: string;
  estimatedBudget: number;
  estimatedTimeframe: string;
  portfolioLinks?: string[];
  attachments?: string[];
  status: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    uid,
    offerUid,
    userUid,
    coverLetter,
    estimatedBudget,
    estimatedTimeframe,
    portfolioLinks,
    attachments,
    status,
    createdAt,
    updatedAt,
  }: ProposalPrimitives) {
    this.uid = uid;
    this.offerUid = offerUid;
    this.userUid = userUid;
    this.coverLetter = coverLetter;
    this.estimatedBudget = estimatedBudget;
    this.estimatedTimeframe = estimatedTimeframe;
    this.portfolioLinks = portfolioLinks;
    this.attachments = attachments;
    this.status = status;
    this.createdAt = createdAt ? new Date(createdAt) : undefined;
    this.updatedAt = updatedAt ? new Date(updatedAt) : undefined;
  }

}
