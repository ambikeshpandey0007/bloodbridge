/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: alertresponses
 * Interface for AlertResponses
 */
export interface AlertResponses {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  sosAlertId?: string;
  /** @wixFieldType text */
  responderType?: string;
  /** @wixFieldType text */
  responderId?: string;
  /** @wixFieldType text */
  responseMessage?: string;
  /** @wixFieldType boolean */
  isAvailableToDonate?: boolean;
  /** @wixFieldType datetime */
  responseDate?: Date | string;
}


/**
 * Collection ID: bloodstock
 * Interface for BloodStock
 */
export interface BloodStock {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  hospitalName?: string;
  /** @wixFieldType text */
  bloodGroup?: string;
  /** @wixFieldType number */
  availableUnits?: number;
  /** @wixFieldType text */
  address?: string;
  /** @wixFieldType text */
  city?: string;
  /** @wixFieldType text */
  state?: string;
  /** @wixFieldType text */
  zipCode?: string;
  /** @wixFieldType text */
  contactNumber?: string;
}


/**
 * Collection ID: donationhistory
 * Interface for DonationHistory
 */
export interface DonationHistory {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  donorName?: string;
  /** @wixFieldType text */
  hospitalName?: string;
  /** @wixFieldType date */
  donationDate?: Date | string;
  /** @wixFieldType number */
  unitsDonated?: number;
  /** @wixFieldType text */
  donationType?: string;
  /** @wixFieldType boolean */
  isSuccessful?: boolean;
  /** @wixFieldType number */
  number?: number;
}


/**
 * Collection ID: donorbadges
 * Interface for DonorBadges
 */
export interface DonorBadges {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  badgeName?: string;
  /** @wixFieldType number */
  minDonationCount?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  badgeImage?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType number */
  rewardPoints?: number;
}


/**
 * Collection ID: hospitals
 * Interface for Hospitals
 */
export interface Hospitals {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType boolean */
  isVerified?: boolean;
  /** @wixFieldType date */
  verificationDate?: Date | string;
  /** @wixFieldType text */
  verificationDetails?: string;
  /** @wixFieldType text */
  hospitalName?: string;
  /** @wixFieldType text */
  registrationNumber?: string;
  /** @wixFieldType text */
  mobileNumber?: string;
  /** @wixFieldType text */
  address?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  contactPerson?: string;
  /** @wixFieldType boolean */
  isBloodBank?: boolean;
}


/**
 * Collection ID: publicusers
 * Interface for PublicUsers
 */
export interface PublicUsers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  mobileNumber?: string;
  /** @wixFieldType text */
  aadharNumber?: string;
  /** @wixFieldType text */
  bloodGroup?: string;
  /** @wixFieldType number */
  age?: number;
  /** @wixFieldType number */
  totalDonations?: number;
  /** @wixFieldType date */
  lastDonationDate?: Date | string;
}


/**
 * Collection ID: sosalerts
 * Interface for SOSAlerts
 */
export interface SOSAlerts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  patientName?: string;
  /** @wixFieldType number */
  patientAge?: number;
  /** @wixFieldType text */
  bloodGroupRequired?: string;
  /** @wixFieldType number */
  unitsNeeded?: number;
  /** @wixFieldType text */
  contactMobile?: string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType text */
  requestStatus?: string;
  /** @wixFieldType datetime */
  requestDateTime?: Date | string;
}
