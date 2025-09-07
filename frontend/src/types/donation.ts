export enum DonationType {
  MONEY = "money",
  FOOD = "food",
  CLOTHING = "clothing",
  HOUSEHOLD_ITEMS = "household_items",
  TOYS = "toys",
  BOOKS = "books",
  OTHER = "other",
}

export interface Donation {
  id: string;
  donorName: string;
  type: DonationType;
  quantity: number; // For money this represents amount, for items it's quantity
  unit: string; // e.g., "dollars", "pounds", "pieces", "bags"
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDonationRequest {
  donorName: string;
  type: DonationType;
  quantity: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface UpdateDonationRequest {
  donorName?: string;
  type?: DonationType;
  quantity?: number;
  unit?: string;
  date?: string;
  notes?: string;
}
