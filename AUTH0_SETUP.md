# Auth0 Setup Instructions for Gmail Authentication

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3001'
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

2. **Enable Google Social Connection:**
   - Go to Authentication > Social
   - Click on "Google"
   - Enable the connection
   - Configure with your Google OAuth credentials
   - Set the connection name to `google-oauth2`

3. **Configure Application Settings:**
   - **Allowed Callback URLs:** `http://localhost:3001/api/auth/callback`
   - **Allowed Logout URLs:** `http://localhost:3001`
   - **Allowed Web Origins:** `http://localhost:3001`

4. **Get Your Credentials:**
   - Copy the Domain, Client ID, and Client Secret
   - Update your `.env.local` file with these values

5. **Generate AUTH0_SECRET:**
   - Run: `openssl rand -hex 32`
   - Use the generated value for `AUTH0_SECRET`

## Features Implemented

- ✅ Dedicated login page with Gmail authentication
- ✅ Auth0 SDK integration with Google OAuth
- ✅ User profile dropdown with avatar
- ✅ Clean header with conditional login/user profile
- ✅ Automatic redirect after login
- ✅ User session management

## How to Use

1. **Start your development server:** `npm run dev`
2. **Click the Login button** in the header (or go to `/login`)
3. **You'll be redirected to Google** for Gmail authentication
4. **After successful login**, you'll be redirected to the dashboard
5. **The header will show your profile** with avatar and logout option

## Login Flow

- **Unauthenticated users** see a "Login" button in the header
- **Clicking Login** takes them to `/login` page
- **Login page** has a "Continue with Gmail" button
- **After authentication**, users are redirected to `/dashboard`
- **Authenticated users** see their profile dropdown in the header
