/**
 * Better Auth API Route Handler - Catch all /api/auth/* routes
 * This handles all Better Auth endpoints including:
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-up/email
 * - GET /api/auth/session
 * - POST /api/auth/sign-out
 * - GET /api/auth/callback/github
 * - GET /api/auth/callback/google
 */
import { auth } from "@/lib/auth";

// The [...auth] filename creates a catch-all route that matches /api/auth/*
export async function GET(request: Request) {
  return auth.handler(request);
}

export async function POST(request: Request) {
  return auth.handler(request);
}
