import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";
import { headers } from "next/headers";

export const auth = betterAuth({
  appName: "AI Resume Analyzer",
  
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  baseURL: process.env.BETTER_AUTH_URL,
});

export async function getSession() {
  const result = await auth.api.getSession({
    headers:await headers()
  });

  return result;
}