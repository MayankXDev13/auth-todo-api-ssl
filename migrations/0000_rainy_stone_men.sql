CREATE TYPE "public"."priority" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid,
	"title" text NOT NULL,
	"description" text,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"priority" "priority" DEFAULT 'medium' NOT NULL,
	"due_date" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"refresh_token" text,
	"forgot_password_token" text,
	"forgot_password_token_expiry" timestamp,
	"email_verification_token" text,
	"email_verification_token_expiry" timestamp,
	"email_verified" boolean DEFAULT false,
	"role" "role" DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "userId_idx" ON "todos" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "title_idx" ON "todos" USING btree ("title");--> statement-breakpoint
CREATE INDEX "status_idx" ON "todos" USING btree ("status");--> statement-breakpoint
CREATE INDEX "priority_idx" ON "todos" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "dueDate_idx" ON "todos" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "refresh_token_idx" ON "users" USING btree ("refresh_token");--> statement-breakpoint
CREATE INDEX "forgot_password_token_idx" ON "users" USING btree ("forgot_password_token");--> statement-breakpoint
CREATE INDEX "forgot_password_token_expiry_idx" ON "users" USING btree ("forgot_password_token_expiry");--> statement-breakpoint
CREATE INDEX "role_idx" ON "users" USING btree ("role");