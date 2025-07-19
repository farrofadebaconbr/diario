// File: src/lib/server/auth.ts
import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import prisma from './database';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // use secure cookies in production
      secure: !dev
    }
  },
  getUserAttributes: (attributes) => {
    return {
      userId: attributes.id,
      email: attributes.email,
      username: attributes.username
    };
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      username: string;
    };
  }
}