export type TopHeadlines<T> = T[];

export interface WorkerResource {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
  role: string;
  profileType: string;
  location: string;
  bio: string;
  skills: string[];
  experience: number;
  certifications: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  yapeNumber?: string;
  plinNumber?: string;
  bankAccountNumber?: string;
  createdAt: string;
  availability: {
    lunes?: string;
    martes?: string;
    miercoles?: string;
    jueves?: string;
    viernes?: string;
    sabado?: string;
    domingo?: string;
  };
  updatedAt: string;
}

export interface CustomerResource {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  profileType: string;
  location: string;
  bio: string;
  isVerified: boolean;
  preferences: {
    notifications: { email: boolean; push: boolean; sms: boolean };
    privacy: { showPhone: boolean; showEmail: boolean; showLocation: boolean };
    language: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserResource {
  id: number;
  accountId: number;
  workerId?: number;
  customerId?: number;
}

export enum PreferredAvailability {
  Immediate = 'Immediate',
  Mornings = 'Mornings',
  Afternoons = 'Afternoons',
  Nights = 'Nights'
}

export interface PreferencesResource {
  id: number;
  customerId: number;
  preferredCategory?: string;
  preferredLocation?: string;
  preferredServiceType?: string;
  preferredExperienceYears?: string[];
  preferredAvailability?: PreferredAvailability;
  minAcceptableRating?: number;
  estimatedBudgetRange?: { min: number; max: number };
  languages?: string[];
} 