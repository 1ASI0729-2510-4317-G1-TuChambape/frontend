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
  preferences!: {
    notifications: { email: boolean; push: boolean; sms: boolean };
    privacy: { showPhone: boolean; showEmail: boolean; showLocation: boolean };
    language: string;
    timezone: string;
  };
  createdAt!: string;
  updatedAt!: string;
  availability!: {
    lunes?: string;
    martes?: string;
    miercoles?: string;
    jueves?: string;
    viernes?: string;
    sabado?: string;
    domingo?: string;
  };

  constructor(params: Worker) {
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
    this.preferences = params.preferences;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.availability = params.availability;
  }
} 