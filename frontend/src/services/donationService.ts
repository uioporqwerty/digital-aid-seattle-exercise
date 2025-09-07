import {
  Donation,
  CreateDonationRequest,
  UpdateDonationRequest,
} from "@/types/donation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class DonationService {
  static async getAllDonations(): Promise<Donation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations`);
      if (!response.ok) {
        throw new Error(`Failed to fetch donations: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching donations:", error);
      throw error;
    }
  }

  static async createDonation(
    donation: CreateDonationRequest
  ): Promise<Donation> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donation),
      });

      if (!response.ok) {
        throw new Error(`Failed to create donation: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating donation:", error);
      throw error;
    }
  }

  static async updateDonation(
    id: string,
    updates: UpdateDonationRequest
  ): Promise<Donation> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update donation: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating donation:", error);
      throw error;
    }
  }

  static async deleteDonation(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete donation: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting donation:", error);
      throw error;
    }
  }
}
