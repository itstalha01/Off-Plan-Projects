CREATE TABLE "unit_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"unit_id" text NOT NULL,
	"blob_url" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "unit_documents" ADD CONSTRAINT "unit_documents_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;