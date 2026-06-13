DROP INDEX "refresh_token_idx";--> statement-breakpoint
DROP INDEX "forgot_password_token_idx";--> statement-breakpoint
DROP INDEX "forgot_password_token_expiry_idx";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "refresh_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "forgot_password_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "forgot_password_token_expiry";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verification_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verification_token_expiry";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verified";