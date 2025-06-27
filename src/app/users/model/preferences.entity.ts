import { PreferencesResource, PreferredAvailability } from '../services/top-headlines.response';

export class Preferences {
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

  constructor(params: PreferencesResource) {
    this.id = params.id;
    this.customerId = params.customerId;
    this.preferredCategory = params.preferredCategory;
    this.preferredLocation = params.preferredLocation;
    this.preferredServiceType = params.preferredServiceType;
    this.preferredExperienceYears = params.preferredExperienceYears;
    this.preferredAvailability = params.preferredAvailability;
    this.minAcceptableRating = params.minAcceptableRating;
    this.estimatedBudgetRange = params.estimatedBudgetRange;
    this.languages = params.languages;
  }
} 