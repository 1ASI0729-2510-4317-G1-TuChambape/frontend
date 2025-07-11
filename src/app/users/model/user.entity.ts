import { UserResource } from "../services/top-headlines.response";
import { Customer } from "./customer.entity";
import { Worker } from "./worker.entity";

export class User {
  id!: number;
  accountId!: number;
  worker?: Worker;
  customer?: Customer;

  constructor(params: UserResource) {
    this.id = params.id;
    this.accountId = params.accountId;
    this.worker = params.worker ? new Worker(params.worker) : undefined;
    this.customer = params.customer ? new Customer(params.customer) : undefined;
  }
} 