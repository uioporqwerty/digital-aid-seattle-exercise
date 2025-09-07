"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Chip,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  Donation,
  DonationType,
  UpdateDonationRequest,
} from "@/types/donation";

interface DonationListProps {
  donations: Donation[];
  onUpdate: (id: string, updates: UpdateDonationRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export default function DonationList({
  donations,
  onUpdate,
  onDelete,
  loading = false,
}: DonationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateDonationRequest>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateError, setUpdateError] = useState<string>("");

  const formatDonationType = (type: DonationType): string => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string): string => {
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const handleEditStart = (donation: Donation) => {
    setEditingId(donation.id);
    setEditFormData({
      donorName: donation.donorName,
      type: donation.type,
      quantity: donation.quantity,
      unit: donation.unit,
      date: donation.date,
      notes: donation.notes,
    });
    setErrors({});
    setUpdateError("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({});
    setErrors({});
    setUpdateError("");
  };

  const validateEditForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editFormData.donorName?.trim()) {
      newErrors.donorName = "Donor name is required";
    }

    if (!editFormData.type) {
      newErrors.type = "Donation type is required";
    }

    if (!editFormData.quantity || editFormData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (!editFormData.unit?.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (!editFormData.date || !dayjs(editFormData.date).isValid()) {
      newErrors.date = "Valid date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSave = async () => {
    setUpdateError("");

    if (!validateEditForm() || !editingId) {
      return;
    }

    try {
      const updates: UpdateDonationRequest = {
        donorName: editFormData.donorName?.trim(),
        type: editFormData.type,
        quantity: editFormData.quantity,
        unit: editFormData.unit?.trim(),
        date: editFormData.date,
        notes: editFormData.notes?.trim(),
      };

      await onUpdate(editingId, updates);
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Failed to update donation"
      );
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await onDelete(id);
      setDeleteDialogOpen(null);
    } catch (error) {
      console.error("Failed to delete donation:", error);
    }
  };

  const handleEditFieldChange = (field: string, value: any) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (donations.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ py: 4 }}
          >
            No donations recorded yet. Add your first donation above!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Typography variant="h5" component="h2">
            Donation History ({donations.length})
          </Typography>
        </CardHeader>
        <CardContent sx={{ p: 0 }}>
          {updateError && (
            <Alert severity="error" sx={{ m: 2 }}>
              {updateError}
            </Alert>
          )}

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Donor Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell width={120}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id} hover>
                    {editingId === donation.id ? (
                      // Edit mode
                      <>
                        <TableCell>
                          <TextField
                            size="small"
                            value={editFormData.donorName || ""}
                            onChange={(e) =>
                              handleEditFieldChange("donorName", e.target.value)
                            }
                            error={!!errors.donorName}
                            disabled={loading}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl
                            size="small"
                            error={!!errors.type}
                            disabled={loading}
                          >
                            <Select
                              value={editFormData.type || ""}
                              onChange={(e) =>
                                handleEditFieldChange("type", e.target.value)
                              }
                              displayEmpty
                            >
                              <MenuItem value={DonationType.MONEY}>
                                Money
                              </MenuItem>
                              <MenuItem value={DonationType.FOOD}>
                                Food
                              </MenuItem>
                              <MenuItem value={DonationType.CLOTHING}>
                                Clothing
                              </MenuItem>
                              <MenuItem value={DonationType.HOUSEHOLD_ITEMS}>
                                Household Items
                              </MenuItem>
                              <MenuItem value={DonationType.TOYS}>
                                Toys
                              </MenuItem>
                              <MenuItem value={DonationType.BOOKS}>
                                Books
                              </MenuItem>
                              <MenuItem value={DonationType.OTHER}>
                                Other
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={editFormData.quantity || ""}
                            onChange={(e) =>
                              handleEditFieldChange(
                                "quantity",
                                parseFloat(e.target.value)
                              )
                            }
                            error={!!errors.quantity}
                            disabled={loading}
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={editFormData.unit || ""}
                            onChange={(e) =>
                              handleEditFieldChange("unit", e.target.value)
                            }
                            error={!!errors.unit}
                            disabled={loading}
                          />
                        </TableCell>
                        <TableCell>
                          <DatePicker
                            value={dayjs(editFormData.date)}
                            onChange={(newValue) =>
                              handleEditFieldChange(
                                "date",
                                newValue?.toISOString()
                              )
                            }
                            disabled={loading}
                            slotProps={{
                              textField: {
                                size: "small",
                                error: !!errors.date,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={editFormData.notes || ""}
                            onChange={(e) =>
                              handleEditFieldChange("notes", e.target.value)
                            }
                            disabled={loading}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={handleEditSave}
                              disabled={loading}
                              color="primary"
                            >
                              <SaveIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={handleEditCancel}
                              disabled={loading}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </>
                    ) : (
                      // View mode
                      <>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {donation.donorName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={formatDonationType(donation.type)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {donation.quantity.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {donation.unit}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(donation.date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {donation.notes || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditStart(donation)}
                              disabled={loading}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => setDeleteDialogOpen(donation.id)}
                              disabled={loading}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={!!deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this donation? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(null)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              deleteDialogOpen && handleDeleteConfirm(deleteDialogOpen)
            }
            color="error"
            variant="contained"
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
