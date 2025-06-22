import { OfferResource } from "../services/top-headlines.response";

export class Offer {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientEmail: string;
  status: OfferResource["status"];
  category: string;
  location: string;
  budget: OfferResource["budget"];
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
  deadline: string;
  proposalsCount: number;
  selectedProposalId?: number | null;
  startAt?: Date | string;


  constructor(offerParams: OfferResource) {
    this.id = offerParams.id;
    this.title = offerParams.title;
    this.description = offerParams.description;
    this.clientId = offerParams.clientId;
    this.clientEmail = offerParams.clientEmail;
    this.status = offerParams.status;
    this.category = offerParams.category;
    this.location = offerParams.location;
    this.budget = offerParams.budget;
    this.requirements = offerParams.requirements;
    this.createdAt = offerParams.createdAt;
    this.updatedAt = offerParams.updatedAt;
    this.deadline = offerParams.deadline;
    this.proposalsCount = offerParams.proposalsCount;
    this.selectedProposalId = (offerParams as any).selectedProposalId ?? null;
    this.startAt = offerParams.startAt;
  }
}