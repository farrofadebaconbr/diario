// File: src/routes/(auth)/register/+page.server.ts
import { registerSchema } from '$lib/schemas/authSchema';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';
import prisma from '$lib/server/database';

export const load = async (event) => {
  if (event.locals.user) {
    redirect(302, '/'); // Redireciona usuários logados
  }
  const form = await superValidate(zod(registerSchema));
  return { form };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(registerSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, username, password } = form.data;

    // Checa se o usuário já existe
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (existingUser) {
      return fail(400, {
        message: 'A user with that email or username already exists.',
        form
      });
    }

    const hashedPassword = await new Argon2id().hash(password);
    const userId = crypto.randomUUID(); // Gera um ID único

    await prisma.user.create({
      data: {
        id: userId,
        username,
        email,
        keys: {
          create: {
            id: 'email', // providerId para Lucia
            hashedPassword
          }
        }
      }
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    redirect(302, '/');
  }
};