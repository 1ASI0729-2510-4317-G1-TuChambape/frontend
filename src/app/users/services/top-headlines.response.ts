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
  preferences: {
    notifications: { email: boolean; push: boolean; sms: boolean };
    privacy: { showPhone: boolean; showEmail: boolean; showLocation: boolean };
    language: string;
    timezone: string;
  };
  createdAt: string;
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