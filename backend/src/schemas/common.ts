import { Type } from "@sinclair/typebox";

export const ErrorSchema = Type.Object({
  error: Type.String(),
});

export const SuccessSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.Optional(Type.String()),
});

export const HealthSchema = Type.Object({
  status: Type.String(),
  timestamp: Type.String(),
  uptime: Type.Number(),
  environment: Type.String(),
});

export const ApiInfoSchema = Type.Object({
  name: Type.String(),
  version: Type.String(),
  description: Type.String(),
  endpoints: Type.Record(Type.String(), Type.String()),
});
