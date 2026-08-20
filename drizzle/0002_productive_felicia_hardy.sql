CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "inventory_shares" ADD COLUMN "owner_id" text;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "owner_id" text;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "sector" text;--> statement-breakpoint
ALTER TABLE "inventory_shares" ADD CONSTRAINT "inventory_shares_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;