'use client';

import { Auth0Provider } from '@auth0/nextjs-auth0';

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't pass an explicit `user` prop here. The Auth0Provider will
  // hydrate its SWR fallback from the client-side auth routes. Forcing
  // `user={undefined}` prevented `useUser()` from seeing an authenticated
  // session and caused CTAs to always route to /login.
  return <Auth0Provider>{children}</Auth0Provider>;
}
