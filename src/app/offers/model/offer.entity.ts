export interface OfferPrimitives {
  uid: string
  userUid: string
  title: string
  description: string
  technicalCategory: string
  location: string
  estimatedBudget: number
  paymentMethod: string
  requiredExperience: string
  workSchedule: string
  notificationsAccepted: boolean
  personalDataConsent: boolean
  createdAt?: string
  updatedAt?: string
}

export class Offer {
  constructor(
    public readonly uid: string,
    public readonly userUid: string,
    public readonly title: string,
    public readonly description: string,
    public readonly technicalCategory: string,
    public readonly location: string,
    public readonly estimatedBudget: number,
    public readonly paymentMethod: string,
    public readonly requiredExperience: string,
    public readonly workSchedule: string,
    public readonly notificationsAccepted: boolean,
    public readonly personalDataConsent: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
