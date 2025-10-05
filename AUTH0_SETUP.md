# Auth0 Setup Instructions

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_DOMAIN.auth0.com'
AUTH0_CLIENT_ID='your_client_id'
AUTH0_CLIENT_SECRET='your_client_secret'

# Optional: Customize the session
AUTH0_SESSION_ROLLING_DURATION=86400
AUTH0_SESSION_ABSOLUTE_DURATION=604800
```

## Auth0 Dashboard Configuration

1. **Create an Auth0 Application:**
   - Go to your Auth0 Dashboard
   - Navigate to Applications > Applications
   - Click "Create Application"
   - Choose "Regular Web Applications"

2. **Configure Application Settings:**
   - **Allowed Callback URLs:** `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs:** `http://localhost:3000`
   - **Allowed Web Origins:** `http://localhost:3000`

3. **Get Your Credentials:**
   - Copy the Domain, Client ID, and Client Secret
   - Update your `.env.local` file with these values

4. **Generate AUTH0_SECRET:**
   - Run: `openssl rand -hex 32`
   - Use the generated value for `AUTH0_SECRET`

## Features Implemented

- ✅ Auth0 SDK integration
- ✅ Login/Logout functionality
- ✅ Protected routes (Dashboard, Interview pages)
- ✅ User session management
- ✅ Middleware for route protection
- ✅ User profile display in header

## Protected Routes

The following routes now require authentication:
- `/dashboard/*`
- `/interview/*`
- `/api/dashboard/*`
- `/api/interview/*`

## Usage

1. Start your development server: `npm run dev`
2. Navigate to any protected route
3. You'll be redirected to Auth0 login
4. After login, you'll be redirected back to your app
5. The header will show your user info and logout button
