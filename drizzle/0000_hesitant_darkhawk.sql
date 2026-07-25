CREATE TYPE "public"."rate_unit" AS ENUM('marla', 'kanal');--> statement-breakpoint
CREATE TYPE "public"."unit_status" AS ENUM('available', 'hold', 'sold_out');--> statement-breakpoint
CREATE TYPE "public"."unit_type" AS ENUM('plot', 'shop', 'plaza', 'hotel');--> statement-breakpoint
CREATE TABLE "inventory_shares" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"unit_ids" jsonb NOT NULL,
	"visible_fields" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp,
	CONSTRAINT "inventory_shares_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "unit_photos" (
	"id" text PRIMARY KEY NOT NULL,
	"unit_id" text NOT NULL,
	"blob_url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text DEFAULT 'commercial' NOT NULL,
	"type" "unit_type" NOT NULL,
	"city" text NOT NULL,
	"area" text NOT NULL,
	"address" text NOT NULL,
	"unit_number" text,
	"map_link" text,
	"area_sqft" numeric(12, 2) NOT NULL,
	"front_ft" numeric(10, 2),
	"depth_ft" numeric(10, 2),
	"area_input_mode" text NOT NULL,
	"rate" numeric(14, 2) NOT NULL,
	"rate_unit" "rate_unit" NOT NULL,
	"total_price" numeric(16, 2) NOT NULL,
	"status" "unit_status" DEFAULT 'available' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "unit_photos" ADD CONSTRAINT "unit_photos_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;