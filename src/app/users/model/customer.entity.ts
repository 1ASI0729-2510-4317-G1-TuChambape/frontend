import { CustomerResource } from "../services/top-headlines.response";

export class Customer {
  id!: number;
  accountId!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  phone!: string;
  location!: string;
  bio!: string;
  isVerified!: boolean;

  constructor(params: CustomerResource) {
    this.id = params.id;
    this.accountId = params.accountId;
    this.email = params.email;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.phone = params.phone;
    this.location = params.location;
    this.bio = params.bio;
    this.isVerified = params.isVerified;
  }
} 