MockMate 🌟
--------------------------

### Overview

**MockMate** is a sophisticated, full-stack web application designed to revolutionize technical and behavioral interview preparation. Built primarily with **Next.js**, it simulates real-time conversations using the cutting-edge Google **Gemini AI**, providing **instant, objective feedback** on the user's content and communication style. Our mission is to transform interview anxiety into confidence, ensuring users walk into their next opportunity fully prepared.

### ✨ Key Features

*   **Serverless AI Simulation:** Utilizes **Next.js API Routes** to securely proxy requests to the **Gemini API**, ensuring your API key is never exposed on the client-side.
    
*   **Real-Time Performance Analysis:** Provides immediate scoring (on a scale of 1-10) and detailed feedback on technical accuracy, structure, and communication effectiveness.
    
*   **Voice and Text Interaction:** Supports both spoken (via browser APIs) and typed responses for a flexible practice experience.
    
*   **Customizable Sessions:** Users can select interview types (e.g., Data Science, Software Engineering), technical domains, and desired difficulty levels.
    
*   **Performance Dashboard:** Tracks user progress across multiple sessions, storing data directly in a managed NoSQL or serverless database (e.g., Firebase, Supabase).
    
*   **Secure Authentication:** User data and session history are protected via **Firebase Authentication** or **NextAuth**.
    

### 🛠️ Technology Stack

CategoryTechnologiesDescription**FrameworkNext.js**React framework for frontend and serverless API Routes.**FrontendReact, TypeScript**Component-based UI development.**AI CoreGoogle Gemini API**Powers the interviewer logic, scoring, and feedback generation.**Data/AuthFirebase (or Supabase)**Provides secure, managed user sign-up/login and data storage.**StylingTailwind CSS**Utility-first CSS framework for rapid styling.**DevOpsVercel**Hosting platform, perfectly integrated with Next.js.

### 🚀 Getting Started

Follow these steps to get a development copy of the project running on your local machine.

### Prerequisites

*   **Node.js v18+**
    
*   A **Gemini API Key** from Google AI Studio.
    
*   A **Firebase Project** configured for web (or a similar backend-as-a-service like Supabase).
    

### Installation

1.  Bashgit clone https://github.com/YourGitHubUsername/ai-interview-prep-buddy.gitcd ai-interview-prep-buddy
    
2.  Bashnpm install
    

### Configuration (Environment Variables)

Create a file named **.env.local** in the root directory. **Replace the placeholder values with your actual credentials.**

**.env.local**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Gemini API Key (Used ONLY in Next.js API Routes)  GEMINI_API_KEY="AIzaSy...your_gemini_key...xyz"  # Firebase Config (for client-side authentication and database access)  NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"  NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"  # ... other Firebase/Supabase keys   `

### Running the Application

*   Bashnpm run dev
    

The application will now be running at http://localhost:3000.

### 🤝 Contributing

We actively welcome and appreciate contributions to the **AI Interview Prep Buddy** project!

1.  Fork the repository and clone your fork.
    
2.  Create a new feature branch (git checkout -b feature/new-behavioral-model).
    
3.  Commit your changes with clear, descriptive messages.
    
4.  Push your branch to your fork.
    
5.  Open a detailed **Pull Request** explaining the changes and linking to any relevant issues.
    

