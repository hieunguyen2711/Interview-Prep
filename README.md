# InterviewAI - Smart Interview Prep Platform

An AI-powered platform for practicing behavioral and technical interviews with real-time feedback.

## Features

- 🎤 **Voice Interaction**: Speak your answers naturally with real-time transcription
- 🤖 **AI Feedback**: Get detailed analysis and scoring from advanced AI
- 💻 **Code Editor**: Practice technical interviews with live coding
- 📊 **Progress Tracking**: Monitor improvement with detailed analytics

## Setup Instructions

### 1. Environment Variables

You need to add the following environment variables to your Vercel project:

#### Firebase Configuration
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

#### ElevenLabs API (for Speech-to-Text and Text-to-Speech)
\`\`\`
ELEVENLABS_API_KEY=your_elevenlabs_api_key
\`\`\`

#### Gemini API (for AI question generation and feedback)
\`\`\`
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Copy your configuration values to the environment variables above

### 3. API Keys

- **ElevenLabs**: Sign up at [elevenlabs.io](https://elevenlabs.io/) and get your API key
- **Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS v4 + Shadcn UI
- **AI APIs**: ElevenLabs (STT/TTS) + Gemini (Question Generation & Feedback)
- **Database**: Firebase Firestore
- **Deployment**: Vercel

## Getting Started

1. Install dependencies (handled automatically by v0)
2. Add environment variables in Project Settings
3. Deploy to Vercel or run locally

## Project Structure

\`\`\`
app/
├── page.tsx              # Landing page
├── interview/            # Interview pages
├── dashboard/            # User dashboard
└── api/                  # API routes

components/
├── ui/                   # Shadcn UI components
└── interview/            # Interview-specific components

lib/
├── firebase.ts           # Firebase configuration
└── api-config.ts         # API configuration

types/
└── interview.ts          # TypeScript types
