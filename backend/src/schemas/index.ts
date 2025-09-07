/**
 * Central export for all schemas
 * This makes it easy to import schemas from a single location
 */

// Common schemas
export {
  ErrorSchema,
  SuccessSchema,
  HealthSchema,
  ApiInfoSchema,
} from './common';

// Donation-specific schemas
export {
  DonationTypeSchema,
  DonationSchema,
  CreateDonationSchema,
  UpdateDonationSchema,
  DonationStatsSchema,
  DonationParamsSchema,
} from './donation';
