import { Type } from "@sinclair/typebox";

export const DonationTypeSchema = Type.Union([
  Type.Literal("money"),
  Type.Literal("food"),
  Type.Literal("clothing"),
  Type.Literal("household_items"),
  Type.Literal("toys"),
  Type.Literal("books"),
  Type.Literal("other"),
]);

export const DonationSchema = Type.Object({
  id: Type.String(),
  donorName: Type.String(),
  type: DonationTypeSchema,
  quantity: Type.Number(),
  unit: Type.String(),
  date: Type.String(),
  notes: Type.Optional(Type.String()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export const CreateDonationSchema = Type.Object({
  donorName: Type.String({ minLength: 1 }),
  type: DonationTypeSchema,
  quantity: Type.Number({ minimum: 0 }),
  unit: Type.String({ minLength: 1 }),
  date: Type.String(),
  notes: Type.Optional(Type.String()),
});

export const UpdateDonationSchema = Type.Object({
  donorName: Type.Optional(Type.String({ minLength: 1 })),
  type: Type.Optional(DonationTypeSchema),
  quantity: Type.Optional(Type.Number({ minimum: 0 })),
  unit: Type.Optional(Type.String({ minLength: 1 })),
  date: Type.Optional(Type.String()),
  notes: Type.Optional(Type.String()),
});

export const DonationStatsSchema = Type.Object({
  totalDonations: Type.Number(),
  totalMoneyDonated: Type.Number(),
  donationsByType: Type.Record(Type.String(), Type.Number()),
  recentDonations: Type.Array(DonationSchema),
});

export const DonationParamsSchema = Type.Object({
  id: Type.String(),
});
