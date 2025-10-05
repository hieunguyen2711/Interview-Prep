'use client';

import { Auth0Provider } from '@auth0/nextjs-auth0';

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Auth0Provider user={undefined}>
      {children}
    </Auth0Provider>
  );
}
