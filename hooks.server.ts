// File: src/hooks.server.ts (COMPATÍVEL COM LUCIA v2.x)
import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Tenta obter o ID da sessão a partir do cookie
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  // Se não houver session ID, o usuário não está logado
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  // Valida a sessão usando o Lucia
  const { session, user } = await lucia.validateSession(sessionId);

  // Se a sessão for nova (fresh), atualiza o cookie no navegador
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }

  // Se a sessão for inválida, remove o cookie do navegador
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }

  // Disponibiliza o `user` e `session` para `event.locals`
  event.locals.user = user;
  event.locals.session = session;

  // Continua o fluxo da requisição
  return resolve(event);
};