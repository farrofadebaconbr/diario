// File: src/routes/(auth)/login/+page.server.ts
import { loginSchema } from '$lib/schemas/authSchema';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';
import prisma from '$lib/server/database';

export const load = async (event) => {
  if (event.locals.user) {
    redirect(302, '/'); // Redireciona usuários já logados
  }
  const form = await superValidate(zod(loginSchema));
  return { form };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(loginSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { keys: true } // Inclui as chaves para verificar a senha
    });

    if (!existingUser) {
      return fail(400, { message: 'Incorrect email or password', form });
    }
    
    const key = existingUser.keys.find(k => k.id === 'email');
    if (!key || !key.hashedPassword) {
      // Caso de um usuário que não tenha uma chave de senha (ex: OAuth no futuro)
      return fail(400, { message: 'Incorrect email or password', form });
    }

    const validPassword = await new Argon2id().verify(key.hashedPassword, password);
    if (!validPassword) {
      return fail(400, { message: 'Incorrect email or password', form });
    }

    // Sucesso! Cria a sessão
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    redirect(302, '/');
  }
};