import { z } from "zod";

export const unitFilterSchema = z.object({
  city: z.string().optional(),
  area: z.string().optional(),
  sector: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
});

export type UnitFilterInput = z.infer<typeof unitFilterSchema>;

export const unitInputSchema = z
  .object({
    type: z.enum(["plot", "shop", "plaza", "hotel", "house"]),
    category: z.enum(["commercial", "non-commercial", "residential"]).default("commercial"),
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),
    sector: z.string().optional(),
    address: z.string().min(1, "Address is required"),
    unitNumber: z.string().optional(),
    mapLink: z.string().optional(),

    areaInputMode: z.enum(["dimensions", "direct"]),
    frontFt: z.number().positive().optional(),
    depthFt: z.number().positive().optional(),
    areaSqft: z.number().positive().optional(),

    rate: z.number().positive("Rate must be greater than 0"),
    rateUnit: z.enum(["marla", "kanal"]),
    status: z.enum(["available", "hold", "sold_out"]).default("available"),
  })
  .superRefine((data, ctx) => {
    if (data.areaInputMode === "dimensions") {
      if (!data.frontFt) {
        ctx.addIssue({ path: ["frontFt"], code: "custom", message: "Front is required" });
      }
      if (!data.depthFt) {
        ctx.addIssue({ path: ["depthFt"], code: "custom", message: "Depth is required" });
      }
    } else if (!data.areaSqft) {
      ctx.addIssue({ path: ["areaSqft"], code: "custom", message: "Total area is required" });
    }
  });

export type UnitInput = z.infer<typeof unitInputSchema>;
