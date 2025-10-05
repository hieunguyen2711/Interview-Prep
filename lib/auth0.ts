import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '') || 'dev-x6qenhnwo218ygph.us.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  appBaseUrl: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  secret: process.env.AUTH0_SECRET,
  signInReturnToPath: '/interview/new',
  authorizationParameters: {
    response_type: 'code',
    scope: 'openid profile email',
    connection: 'google-oauth2',
  },
});
