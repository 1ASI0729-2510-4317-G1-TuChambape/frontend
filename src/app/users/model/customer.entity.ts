import { CustomerResource } from "../services/top-headlines.response";

export class Customer {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  phone!: string;
  role!: string;
  profileType!: string;
  location!: string;
  bio!: string;
  isVerified!: boolean;
  preferences!: {
    notifications: { email: boolean; push: boolean; sms: boolean };
    privacy: { showPhone: boolean; showEmail: boolean; showLocation: boolean };
    language: string;
    timezone: string;
  };
  createdAt!: string;
  updatedAt!: string;

  constructor(params: CustomerResource) {
    this.id = params.id;
    this.email = params.email;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.phone = params.phone;
    this.role = params.role;
    this.profileType = params.profileType;
    this.location = params.location;
    this.bio = params.bio;
    this.isVerified = params.isVerified;
    this.preferences = params.preferences;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
} 