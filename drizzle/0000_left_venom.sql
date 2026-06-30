CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" date NOT NULL,
	"time" text NOT NULL,
	"location" text NOT NULL,
	"capacity" integer NOT NULL,
	"registered_count" integer DEFAULT 0 NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"price" integer,
	"image_url" text,
	"poster_url" text,
	"category" text NOT NULL,
	"questions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(80) NOT NULL,
	"window_start" timestamp with time zone DEFAULT now() NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	CONSTRAINT "login_attempts_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code_lookup" varchar(64) NOT NULL,
	"code_hash" text NOT NULL,
	"name" text NOT NULL,
	"student_id" varchar(16),
	"email" text,
	"role" varchar(10) DEFAULT 'member' NOT NULL,
	"ticket_email" text,
	"disabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "members_code_lookup_unique" UNIQUE("code_lookup"),
	CONSTRAINT "members_student_id_unique" UNIQUE("student_id")
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"user_name" text NOT NULL,
	"user_email" text NOT NULL,
	"user_student_id" text NOT NULL,
	"ticket_email" text NOT NULL,
	"answers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"attended" boolean DEFAULT false NOT NULL,
	"attended_at" timestamp with time zone,
	CONSTRAINT "registrations_member_event_unique" UNIQUE("member_id","event_id")
);
--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;