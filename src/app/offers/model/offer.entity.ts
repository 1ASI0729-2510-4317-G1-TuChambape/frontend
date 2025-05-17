export interface OfferPrimitives {
  uid: string;
  userUid: string;
  status: string;
  title: string;
  description: string;
  technicalCategory: string;
  location: string;
  estimatedBudget: number;
  paymentMethod: string;
  requiredExperience: string;
  workSchedule: string;
  notificationsAccepted: boolean;
  personalDataConsent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export class Offer {
  uid: string;
  userUid: string;
  status: string;
  title: string;
  description: string;
  technicalCategory: string;
  location: string;
  estimatedBudget: number;
  paymentMethod: string;
  requiredExperience: string;
  workSchedule: string;
  notificationsAccepted: boolean;
  personalDataConsent: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    uid,
    userUid,
    title,
    status,
    description,
    technicalCategory,
    location,
    estimatedBudget,
    paymentMethod,
    requiredExperience,
    workSchedule,
    notificationsAccepted,
    personalDataConsent,
    createdAt,
    updatedAt,
  }: OfferPrimitives) {
    this.uid = uid;
    this.userUid = userUid;
    this.title = title;
    this.description = description;
    this.status = status;
    this.technicalCategory = technicalCategory;
    this.location = location;
    this.estimatedBudget = estimatedBudget;
    this.paymentMethod = paymentMethod;
    this.requiredExperience = requiredExperience;
    this.workSchedule = workSchedule;
    this.notificationsAccepted = notificationsAccepted;
    this.personalDataConsent = personalDataConsent;
    this.createdAt = createdAt ? new Date(createdAt) : undefined;
    this.updatedAt = updatedAt ? new Date(updatedAt) : undefined;
  }

  toPrimitives(): OfferPrimitives {
    return {
      uid: this.uid,
      userUid: this.userUid,
      title: this.title,
      status: this.status,
      description: this.description,
      technicalCategory: this.technicalCategory,
      location: this.location,
      estimatedBudget: this.estimatedBudget,
      paymentMethod: this.paymentMethod,
      requiredExperience: this.requiredExperience,
      workSchedule: this.workSchedule,
      notificationsAccepted: this.notificationsAccepted,
      personalDataConsent: this.personalDataConsent,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }
}
