import { UserResource } from "../services/top-headlines.response";

export class User {
  id!: number;
  accountId!: number;
  workerId?: number;
  customerId?: number;

  constructor(params: UserResource) {
    this.id = params.id;
    this.accountId = params.accountId;
    this.workerId = params.workerId;
    this.customerId = params.customerId;
  }
} 