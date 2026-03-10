CREATE TABLE "befe_report_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"esb_grade" "befe_grade" NOT NULL,
	"csp_grade" "befe_grade" NOT NULL,
	"pci_grade" "befe_grade" NOT NULL,
	"stb_grade" "befe_grade" NOT NULL,
	"has_children" boolean NOT NULL,
	"content" jsonb NOT NULL,
	"model_version" text,
	"prompt_version" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "befe_report_templates_grades_key" UNIQUE("esb_grade","csp_grade","pci_grade","stb_grade","has_children")
);
