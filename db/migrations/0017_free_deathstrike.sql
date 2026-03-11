CREATE TYPE "public"."befe_order_status" AS ENUM('pending', 'paid', 'failed');--> statement-breakpoint
CREATE TABLE "befe_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couple_id" uuid NOT NULL,
	"order_id" text NOT NULL,
	"amount" integer NOT NULL,
	"status" "befe_order_status" DEFAULT 'pending' NOT NULL,
	"payment_key" text,
	"has_children" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "befe_orders_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
ALTER TABLE "befe_orders" ADD CONSTRAINT "befe_orders_couple_id_befe_couples_id_fk" FOREIGN KEY ("couple_id") REFERENCES "public"."befe_couples"("id") ON DELETE cascade ON UPDATE no action;