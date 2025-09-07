import {
  Donation,
  CreateDonationRequest,
  UpdateDonationRequest,
  DonationType,
} from "../types/donation";

export class DonationDataService {
  private donations: Map<string, Donation> = new Map();
  private idCounter = 1;

  constructor() {
    // Seed with some sample data for demonstration
    this.seedData();
  }

  private generateId(): string {
    return `donation_${this.idCounter++}`;
  }

  private seedData(): void {
    const sampleDonations: CreateDonationRequest[] = [
      {
        donorName: "John Smith",
        type: DonationType.MONEY,
        quantity: 100,
        unit: "dollars",
        date: "2024-01-15T08:00:00.000Z",
        notes: "Monthly donation",
      },
      {
        donorName: "Seattle Food Bank",
        type: DonationType.FOOD,
        quantity: 50,
        unit: "pounds",
        date: "2024-01-14T10:30:00.000Z",
        notes: "Canned goods and dry foods",
      },
      {
        donorName: "Community Church",
        type: DonationType.CLOTHING,
        quantity: 25,
        unit: "bags",
        date: "2024-01-12T14:15:00.000Z",
        notes: "Winter coats and blankets",
      },
    ];

    sampleDonations.forEach((donation) => this.create(donation));
  }

  /**
   * Get all donations, sorted by creation date (newest first)
   */
  getAll(): Donation[] {
    return Array.from(this.donations.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Get a donation by ID
   */
  getById(id: string): Donation | null {
    return this.donations.get(id) || null;
  }

  create(donationData: CreateDonationRequest): Donation {
    const now = new Date().toISOString();
    const donation: Donation = {
      id: this.generateId(),
      donorName: donationData.donorName,
      type: donationData.type,
      quantity: donationData.quantity,
      unit: donationData.unit,
      date: donationData.date,
      notes: donationData.notes,
      createdAt: now,
      updatedAt: now,
    };

    this.donations.set(donation.id, donation);
    return donation;
  }

  update(id: string, updates: UpdateDonationRequest): Donation | null {
    const existingDonation = this.donations.get(id);
    if (!existingDonation) {
      return null;
    }

    const updatedDonation: Donation = {
      ...existingDonation,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  delete(id: string): boolean {
    return this.donations.delete(id);
  }

  getStats() {
    const donations = this.getAll();
    const totalDonations = donations.length;
    const totalMoneyDonated = donations
      .filter((d) => d.type === DonationType.MONEY)
      .reduce((sum, d) => sum + d.quantity, 0);

    const donationsByType = donations.reduce((acc, donation) => {
      acc[donation.type] = (acc[donation.type] || 0) + 1;
      return acc;
    }, {} as Record<DonationType, number>);

    return {
      totalDonations,
      totalMoneyDonated,
      donationsByType,
      recentDonations: donations.slice(0, 5),
    };
  }
}

export const donationDataService = new DonationDataService();
