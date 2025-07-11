import { WorkerResource } from "../services/top-headlines.response";

export class Worker {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  phone!: string;
  avatar!: string;
  role!: string;
  profileType!: string;
  location!: string;
  bio!: string;
  skills!: string[];
  experience!: number;
  certifications!: string[];
  rating!: number;
  reviewCount!: number;
  isVerified!: boolean;
  createdAt!: string;
  updatedAt!: string;
  availability!: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
    [key: string]: string | undefined;
  };
  yapeNumber?: string;
  plinNumber?: string;
  bankAccountNumber?: string;

  constructor(params: WorkerResource) {
    this.id = params.id;
    this.email = params.email;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.phone = params.phone;
    this.avatar = params.avatar;
    this.role = params.role;
    this.profileType = params.profileType;
    this.location = params.location;
    this.bio = params.bio;
    this.skills = params.skills;
    this.experience = params.experience;
    this.certifications = params.certifications;
    this.rating = params.rating;
    this.reviewCount = params.reviewCount;
    this.isVerified = params.isVerified;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.availability = params.availability;
    this.yapeNumber = params.yapeNumber;
    this.plinNumber = params.plinNumber;
    this.bankAccountNumber = params.bankAccountNumber;
  }
} 