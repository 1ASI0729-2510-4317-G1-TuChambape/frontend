export class User {
  id!: number;
  accountId!: number;
  workerId?: number;
  customerId?: number;

  constructor(params: User) {
    this.id = params.id;
    this.accountId = params.accountId;
    this.workerId = params.workerId;
    this.customerId = params.customerId;
  }
} 