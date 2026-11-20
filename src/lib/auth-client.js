'use client';
import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';

// Same origin as the Next.js app - no baseURL needed
export const authClient = createAuthClient({ plugins: [jwtClient()] });

export const { signIn, signUp, signOut, useSession, updateUser } = authClient;
