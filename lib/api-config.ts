// API configuration for external services
// Users will need to add these as environment variables

export const apiConfig = {
  // ElevenLabs API for Speech-to-Text and Text-to-Speech
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY || "",
    sttEndpoint: "https://api.elevenlabs.io/v1/speech-to-text",
    ttsEndpoint: "https://api.elevenlabs.io/v1/text-to-speech",
  },

  // Gemini API for question generation and feedback
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    endpoint: "https://generativelanguage.googleapis.com/v1beta",
  },
}

// Required environment variables:
// - ELEVENLABS_API_KEY
// - GEMINI_API_KEY
// - NEXT_PUBLIC_FIREBASE_API_KEY
// - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
// - NEXT_PUBLIC_FIREBASE_PROJECT_ID
// - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
// - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
// - NEXT_PUBLIC_FIREBASE_APP_ID
