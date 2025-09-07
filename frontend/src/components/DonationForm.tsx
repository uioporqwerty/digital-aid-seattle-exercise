"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { DonationType, CreateDonationRequest } from "@/types/donation";

interface DonationFormProps {
  onSubmit: (donation: CreateDonationRequest) => Promise<void>;
  loading?: boolean;
}

/**
 * Form component for creating new donations
 * Features form validation, error handling, and proper UX feedback
 */
export default function DonationForm({
  onSubmit,
  loading = false,
}: DonationFormProps) {
  const [formData, setFormData] = useState({
    donorName: "",
    type: "" as DonationType | "",
    quantity: "",
    unit: "",
    date: dayjs(),
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.donorName.trim()) {
      newErrors.donorName = "Donor name is required";
    }

    if (!formData.type) {
      newErrors.type = "Donation type is required";
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (!formData.date || !formData.date.isValid()) {
      newErrors.date = "Valid date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    try {
      const donation: CreateDonationRequest = {
        donorName: formData.donorName.trim(),
        type: formData.type as DonationType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit.trim(),
        date: formData.date.toISOString(),
        notes: formData.notes.trim() || undefined,
      };

      await onSubmit(donation);

      setFormData({
        donorName: "",
        type: "",
        quantity: "",
        unit: "",
        date: dayjs(),
        notes: "",
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit donation"
      );
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <Typography variant="h5" component="h2">
          Record New Donation
        </Typography>
      </CardHeader>
      <CardContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Donor Name"
                value={formData.donorName}
                onChange={(e) => handleInputChange("donorName", e.target.value)}
                error={!!errors.donorName}
                helperText={errors.donorName}
                required
                disabled={loading}
              />

              <FormControl
                fullWidth
                error={!!errors.type}
                required
                disabled={loading}
              >
                <InputLabel>Donation Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  label="Donation Type"
                >
                  <MenuItem value={DonationType.MONEY}>Money</MenuItem>
                  <MenuItem value={DonationType.FOOD}>Food</MenuItem>
                  <MenuItem value={DonationType.CLOTHING}>Clothing</MenuItem>
                  <MenuItem value={DonationType.HOUSEHOLD_ITEMS}>
                    Household Items
                  </MenuItem>
                  <MenuItem value={DonationType.TOYS}>Toys</MenuItem>
                  <MenuItem value={DonationType.BOOKS}>Books</MenuItem>
                  <MenuItem value={DonationType.OTHER}>Other</MenuItem>
                </Select>
                {errors.type && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1 }}
                  >
                    {errors.type}
                  </Typography>
                )}
              </FormControl>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Quantity/Amount"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                error={!!errors.quantity}
                helperText={errors.quantity}
                required
                disabled={loading}
                inputProps={{ min: 0, step: 0.01 }}
              />

              <TextField
                fullWidth
                label="Unit"
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                error={!!errors.unit}
                helperText={
                  errors.unit || "e.g., dollars, pounds, pieces, bags"
                }
                required
                disabled={loading}
                placeholder="e.g., dollars, pounds, pieces"
              />
            </Stack>

            <DatePicker
              label="Donation Date"
              value={formData.date}
              onChange={(newValue) => handleInputChange("date", newValue)}
              disabled={loading}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.date,
                  helperText: errors.date,
                  required: true,
                },
              }}
            />

            <TextField
              fullWidth
              label="Notes (Optional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              disabled={loading}
              placeholder="Additional details about the donation..."
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ minWidth: 120, alignSelf: "flex-start" }}
            >
              {loading ? "Recording..." : "Record Donation"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
