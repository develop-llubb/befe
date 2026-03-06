CREATE TYPE "public"."befe_report_status" AS ENUM('generating', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "befe_reports" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "befe_reports" ALTER COLUMN "model_version" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "befe_reports" ALTER COLUMN "prompt_version" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "befe_reports" ADD COLUMN "status" "befe_report_status" DEFAULT 'generating' NOT NULL;