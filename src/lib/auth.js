import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { APIError, createAuthMiddleware, getOAuthState } from 'better-auth/api';
import { ObjectId } from 'mongodb';
import { getDb, getMongoClient } from './mongodb';

const PUBLIC_ROLES = ['vendor', 'customer'];
const PROTECTED_FIELDS = ['role', 'isBlocked', 'subscriptionPlan', 'subscriptionExpiresAt'];
const baseURL = (process.env.BETTER_AUTH_URL || 'http://localhost:3000').replace(/\/+$/, '');

/** min 6 chars, one uppercase and one lowercase letter */
export function passwordProblem(pw = '') {
  if (pw.length < 6) return 'Password must be at least 6 characters';
  if (!/[a-z]/.test(pw)) return 'Password must contain a lowercase letter';
  if (!/[A-Z]/.test(pw)) return 'Password must contain an uppercase letter';
  return null;
}

const googleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [baseURL, 'http://localhost:3000'],
  database: mongodbAdapter(getDb(), { client: getMongoClient(), transaction: false }),

  // The business `users` collection IS Better Auth's user table
  user: {
    modelName: 'users',
    additionalFields: {
      role: { type: 'string', required: false, defaultValue: 'customer', input: true },
      isBlocked: { type: 'boolean', required: false, defaultValue: false, input: false },
      businessName: { type: 'string', required: false, input: true },
      subscriptionPlan: { type: 'string', required: false, defaultValue: 'free', input: false },
      subscriptionExpiresAt: { type: 'date', required: false, input: false },
    },
  },

  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {},

  plugins: [
    // Issues short-lived JWTs (signed with keys published at /api/auth/jwks) for the Express API
    jwt({
      jwt: {
        expirationTime: '15m',
        definePayload: ({ user }) => ({ id: user.id, role: user.role }),
      },
    }),
    nextCookies(),
  ],

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        const problem = passwordProblem(ctx.body?.password);
        if (problem) throw new APIError('BAD_REQUEST', { message: problem });
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Admins can never be created through registration. Role is whitelisted here
          // (email sign-up sends it in the body, Google sign-up in the OAuth state).
          let role = user.role;
          if (!role || role === 'customer') {
            const state = await getOAuthState().catch(() => null);
            if (PUBLIC_ROLES.includes(state?.role)) role = state.role;
          }
          if (!PUBLIC_ROLES.includes(role)) role = 'customer';
          return {
            data: {
              ...user,
              role,
              isBlocked: false,
              subscriptionPlan: 'free',
              subscriptionExpiresAt: null,
              businessName: role === 'vendor' ? user.businessName || user.name : null,
            },
          };
        },
      },
      update: {
        before: async (data) => {
          // Users must never change their own role / block state / subscription via profile updates
          if (PROTECTED_FIELDS.some((f) => f in data)) {
            throw new APIError('FORBIDDEN', { message: 'This field cannot be changed' });
          }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const u = await getDb()
            .collection('users')
            .findOne({ _id: new ObjectId(String(session.userId)) }, { projection: { isBlocked: 1 } });
          if (u?.isBlocked) {
            throw new APIError('FORBIDDEN', { message: 'Your account has been blocked. Contact support.' });
          }
        },
      },
    },
  },
});
