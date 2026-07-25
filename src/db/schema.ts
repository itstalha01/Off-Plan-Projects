import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const unitTypeEnum = pgEnum("unit_type", ["plot", "shop", "plaza", "hotel"]);
export const unitStatusEnum = pgEnum("unit_status", ["available", "hold", "sold_out"]);
export const rateUnitEnum = pgEnum("rate_unit", ["marla", "kanal"]);

export const units = pgTable("units", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  category: text("category").notNull().default("commercial"),
  type: unitTypeEnum("type").notNull(),
  city: text("city").notNull(),
  area: text("area").notNull(),
  address: text("address").notNull(),
  unitNumber: text("unit_number"),
  mapLink: text("map_link"),

  areaSqft: numeric("area_sqft", { precision: 12, scale: 2, mode: "number" }).notNull(),
  frontFt: numeric("front_ft", { precision: 10, scale: 2, mode: "number" }),
  depthFt: numeric("depth_ft", { precision: 10, scale: 2, mode: "number" }),
  areaInputMode: text("area_input_mode").notNull(), // "dimensions" | "direct"

  rate: numeric("rate", { precision: 14, scale: 2, mode: "number" }).notNull(),
  rateUnit: rateUnitEnum("rate_unit").notNull(),
  totalPrice: numeric("total_price", { precision: 16, scale: 2, mode: "number" }).notNull(),

  status: unitStatusEnum("status").notNull().default("available"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const unitPhotos = pgTable("unit_photos", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  unitId: text("unit_id")
    .notNull()
    .references(() => units.id, { onDelete: "cascade" }),
  blobUrl: text("blob_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const inventoryShares = pgTable("inventory_shares", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  token: text("token").notNull().unique(),
  unitIds: jsonb("unit_ids").$type<string[]>().notNull(),
  visibleFields: jsonb("visible_fields").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  revokedAt: timestamp("revoked_at"),
});

export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type UnitPhoto = typeof unitPhotos.$inferSelect;
export type InventoryShare = typeof inventoryShares.$inferSelect;
export type NewInventoryShare = typeof inventoryShares.$inferInsert;
