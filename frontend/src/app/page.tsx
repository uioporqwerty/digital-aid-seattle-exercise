"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import DonationForm from "@/components/DonationForm";
import DonationList from "@/components/DonationList";
import {
  Donation,
  CreateDonationRequest,
  UpdateDonationRequest,
} from "@/types/donation";
import { DonationService } from "@/services/donationService";

export default function Home() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedDonations = await DonationService.getAllDonations();
      setDonations(fetchedDonations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDonation = async (donationData: CreateDonationRequest) => {
    try {
      setSubmitLoading(true);
      const newDonation = await DonationService.createDonation(donationData);
      setDonations((prev) => [newDonation, ...prev]);
    } catch (err) {
      throw err; // Let the form handle the error display
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateDonation = async (
    id: string,
    updates: UpdateDonationRequest
  ) => {
    try {
      const updatedDonation = await DonationService.updateDonation(id, updates);
      setDonations((prev) =>
        prev.map((donation) =>
          donation.id === id ? updatedDonation : donation
        )
      );
    } catch (err) {
      throw err; // Let the list component handle the error display
    }
  };

  const handleDeleteDonation = async (id: string) => {
    try {
      await DonationService.deleteDonation(id);
      setDonations((prev) => prev.filter((donation) => donation.id !== id));
    } catch (err) {
      throw err; // Let the list component handle the error display
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box textAlign="center">
          <Typography variant="h1" component="h1" gutterBottom>
            Digital Aid Seattle
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            color="text.secondary"
            gutterBottom
          >
            Donation Management System
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth="600px"
            mx="auto"
          >
            Track and manage donations for our local shelter. Record new
            donations and view the complete donation history.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DonationForm onSubmit={handleCreateDonation} loading={submitLoading} />

        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {!loading && (
          <DonationList
            donations={donations}
            onUpdate={handleUpdateDonation}
            onDelete={handleDeleteDonation}
            loading={submitLoading}
          />
        )}
      </Stack>
    </Container>
  );
}
