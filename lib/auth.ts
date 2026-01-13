/**
 * Better Auth Configuration
 */
import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as authSchema from "../drizzle/schema";
import { getServerEnv } from "./server-env";

const env = getServerEnv();

// Custom fetch with proxy support
const customFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
  // Use proxy only for external OAuth provider requests
  // const urlString = url.toString();
  // const needsProxy = urlString.includes('google') || urlString.includes('googleapis');
  
  return fetch(url, {
    ...init,
    // @ts-ignore - undici Agent type
    // dispatcher: needsProxy ? proxyAgent : undefined,
  });
};

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authSchema.users,
      account: authSchema.account,
      session: authSchema.session,
      verification: authSchema.verification,
    },
  }),
  baseURL: env.VITE_APP_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // We handle verification in registration
    password: {
      hash: (password) => {
        const bcrypt = require("react-native-bcrypt");
        return bcrypt.hashSync(password, 10);
      },
      verify: ({ hash, password }) => {
        const bcrypt = require("react-native-bcrypt");
        return bcrypt.compareSync(password, hash);
      },
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      redirectURI: `${env.VITE_APP_URL || "http://localhost:3000"}/api/auth/callback/github`,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectURI: `${env.VITE_APP_URL || "http://localhost:3000"}/api/auth/callback/google`,
    },
  },
  trustedOrigins: [env.VITE_APP_URL || "http://localhost:3000"],
  session: {
    // Session 过期时间：7天 - session 的总有效期
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    // Session 更新间隔：5分钟 - 在活跃使用时，每5分钟更新一次 session，延长其有效期
    updateAge: 60 * 5, // 5 minutes in seconds - 在用户活跃时自动延长 session
    // 使用 JWT 存储 session
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days - 与 session 过期时间一致
    },
  },
  advanced: {
    // 启用 refresh token 机制
    useSecureCookies: env.NODE_ENV === "production",
    // Custom fetch with proxy support for Google OAuth
    customFetch: customFetch,
    // Disable origin check for React Native compatibility
    disableOriginCheck: true,
  },
  // Enable debug logging to help troubleshoot OAuth issues
  logger: {
    level: "debug",
    disabled: false,
  },
});

export type Session = typeof auth.$Infer.Session;
