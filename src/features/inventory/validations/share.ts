import { z } from "zod";

export const createShareSchema = z.object({
  unitIds: z.array(z.string()).min(1, "Select at least one unit"),
  fields: z.array(z.string()).min(1, "Select at least one field to show"),
});

export type CreateShareInput = z.infer<typeof createShareSchema>;
