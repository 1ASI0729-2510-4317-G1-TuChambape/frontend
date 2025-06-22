export class Preferences {
  userId: number;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showPhone: boolean;
    showEmail: boolean;
    showLocation: boolean;
  };
  language: string;
  timezone: string;
  preferredCategory?: string;
  preferredLocation?: string;
  preferredServiceType?: string;
  preferredExperienceYears?: number;
  preferredAvailability?: string;
  minAcceptableRating?: number;
  estimatedBudgetRange?: { min: number; max: number };
  languages?: string[];
  availability?: string[];

  constructor(params: any) {
    this.userId = params.userId;
    this.notifications = params.notifications;
    this.privacy = params.privacy;
    this.language = params.language;
    this.timezone = params.timezone;
    this.preferredCategory = params.preferredCategory;
    this.preferredLocation = params.preferredLocation;
    this.preferredServiceType = params.preferredServiceType;
    this.preferredExperienceYears = params.preferredExperienceYears;
    this.preferredAvailability = params.preferredAvailability;
    this.minAcceptableRating = params.minAcceptableRating;
    this.estimatedBudgetRange = params.estimatedBudgetRange;
    this.languages = params.languages;
    this.availability = params.availability;
  }
} 