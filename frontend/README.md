# 🚗 Toyota Nexus

**Your Intelligent Vehicle Recommendation Assistant**

<div align="center">


A stunning, AI-powered web application with **aurora animations**, **loading screens**, and **authentication** that helps users find their perfect Toyota vehicle through personalized recommendations.

[🎯 Features](#features) • [🚀 Quick Start](#quick-start) • [🎨 Screenshots](#screenshots) • [🤖 AI Chatbot](#chatbot-modes)

</div>

---

## ✨ What's New

### 🎭 Beautiful Landing Page
- **Aurora background animations** with mouse-tracking effects
- Floating particles and animated gradient blobs
- Smooth transitions and hover effects
- Modern glass-morphism design

### 🔐 Authentication System
- Sign up / Sign in pages with stunning UI
- Password strength indicator
- User profile management
- Session persistence with localStorage
- Protected routes with auth guards

### ⚡ Loading Screen
- Animated logo reveal
- Progress bar with smooth transitions
- Floating particle effects
- 2-second smooth loading experience

### 🎨 Enhanced Animations
- Page transition animations
- Staggered card reveals
- Hover effects on all interactive elements
- Micro-interactions throughout

---

## 🎯 Features

### Core Features

#### 🎯 **Personalized Profile Quiz**
- 6-step questionnaire to understand your needs
- Budget, fuel type, body style, and lifestyle preferences
- Persistent profile storage across sessions

#### 🚗 **Interactive Vehicle Exploration**
- Browse 20+ realistic Toyota vehicles
- Advanced filtering by fuel type, body style, and price range
- Real-time search across vehicle features and descriptions
- Beautiful card-based layout with responsive design

#### 💰 **Payment Simulator**
- **Finance Calculator**: Accurate monthly payment estimates with adjustable APR, term, and down payment
- **Lease Calculator**: Lease payment breakdown with residual value and money factor
- Visual payment breakdown with total cost analysis
- Side-by-side comparison of financing vs. leasing

#### 🤖 **AI-Powered Chatbot**
- **MOCK Mode** (default): Rule-based responses with pre-programmed vehicle knowledge
- **Gemini Mode** (optional): Google Gemini AI integration for advanced conversational support
- Quick suggestion chips for common questions
- Markdown formatting support
- Persistent chat history during session

#### 🎨 **Modern UI/UX**
- Toyota brand colors (red #EB0A1E and black #1A1A1A)
- Framer Motion animations for smooth transitions
- Fully responsive design (mobile, tablet, desktop)
- Aurora background effects
- Glass-morphism components

#### 📊 **Smart Recommendations**
- **ReasonPanel**: Personalized "why this fits you" insights
- Match scoring based on budget, fuel efficiency, and lifestyle tags
- Safety ratings and feature highlights

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm** (or pnpm/yarn)
- (Optional) Google Gemini API key for AI chatbot mode

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd toyota-nexus

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:5173**

### First Time Experience

1. **Loading Screen** - See the animated Toyota Nexus logo (2 seconds)
2. **Landing Page** - Beautiful aurora animations with CTA buttons
3. **Sign Up** - Create your account (mock authentication)
4. **Explore** - Start browsing vehicles!

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🎨 Screenshots

### 🌟 Landing Page with Aurora Animations
![Landing Page](./docs/landing.png)
- Mouse-tracking aurora effect
- Animated gradient blobs
- Floating particles

### ⚡ Loading Screen
![Loading](./docs/loading.png)
- Animated logo reveal
- Progress bar
- Particle effects

### 🔐 Authentication
![Signup](./docs/signup.png)
- Glass-morphism design
- Password strength indicator
- Smooth animations

### 🏠 Home Page
![Home](./docs/home.png)

### 🔍 Explore Vehicles
![Explore](./docs/explore.png)

### 🚗 Vehicle Detail
![Detail](./docs/detail.png)

### 📋 Profile Quiz
![Quiz](./docs/quiz.png)

### 💬 AI Chatbot
![Chatbot](./docs/chatbot.png)

---

## 🤖 Chatbot Modes

### MOCK Mode (Default)

The chatbot uses pre-programmed, rule-based responses. **No API key required.**

**Capabilities:**
- Vehicle recommendations by type (hybrid, SUV, budget-friendly)
- Model comparisons (e.g., "Compare Camry vs. Corolla")
- Lease vs. finance explanations
- Vehicle-specific information searches
- Budget and safety recommendations

**Try these:**
```
"Best hybrids under $400/mo"
"Compare Camry vs. RAV4"
"Tell me about the Prius"
"Explain lease vs finance"
```

### Gemini AI Mode (Optional)

Enable advanced AI responses using Google's Gemini API.

**Setup:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in and create an API key
3. In the chatbot, click the settings gear icon
4. Paste your API key and select a model
5. Click "Save Settings"

**⚠️ Security Warning**: API keys are stored in browser localStorage and sent directly to Google's API. This is a **frontend-only demonstration**. In production, API keys should be stored securely on the server.

**Available Models:**
- **Gemini 1.5 Flash** (Recommended): Fast responses
- **Gemini 1.5 Pro**: Advanced reasoning
- **Gemini Pro**: Legacy model

---

## 🏗️ Tech Stack

### Frontend Framework
- **React 18** with TypeScript
- **Vite** for blazing-fast builds

### Routing & State
- **React Router v6** with protected routes
- **Zustand** with persistence

### Styling & Animation
- **Tailwind CSS** with custom Toyota theme
- **Framer Motion** for animations

### AI Integration
- **Google Generative AI** (Gemini)

### UI Components
- **Lucide React** for icons
- Custom component library

---

## 📂 Project Structure

```
toyota-nexus/
├── public/
│   └── toyota-logo.svg
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable components (Button, Card, etc.)
│   │   ├── layout/          # NavBar, Footer, Hero
│   │   ├── Chatbot.tsx
│   │   ├── SettingsModal.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── ReasonPanel.tsx
│   │   └── PaymentBreakdown.tsx
│   ├── routes/              # Page components
│   │   ├── Landing.tsx      # 🌟 Aurora landing page
│   │   ├── Login.tsx        # 🔐 Sign in
│   │   ├── Signup.tsx       # 🔐 Sign up
│   │   ├── Home.tsx         # Main app home
│   │   ├── Explore.tsx
│   │   ├── VehicleDetail.tsx
│   │   ├── ProfileQuiz.tsx
│   │   └── About.tsx
│   ├── store/
│   │   ├── auth.ts          # 🔐 Authentication store
│   │   └── profile.ts       # User profile store
│   ├── lib/
│   │   ├── filters.ts
│   │   ├── finance.ts       # Finance/lease calculations
│   │   └── ai.ts            # AI chatbot logic
│   ├── data/
│   │   └── vehicles.ts      # 20 Toyota vehicles
│   ├── styles/
│   │   └── globals.css
│   ├── app.tsx              # 🛣️ Routing with auth guards
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🎮 User Flow

### First-Time User

```
1. Loading Screen (2s)
   ↓
2. Landing Page (Aurora animations)
   ↓
3. Click "Get Started"
   ↓
4. Sign Up
   ↓
5. Redirected to /app (Main Home)
   ↓
6. Take Quiz → Explore → Vehicle Details → Chatbot
```

### Returning User

```
1. Loading Screen (2s)
   ↓
2. Landing Page
   ↓
3. Click "Sign In"
   ↓
4. Login
   ↓
5. Redirected to /app (Main Home)
```

---

## 🔐 Authentication

This app uses **simulated authentication** for demonstration purposes:

- **Sign Up**: Enter name, email, and password (min 6 characters)
- **Login**: Use the same email/password
- **Session**: Stored in browser localStorage
- **Protected Routes**: `/app/*` routes require authentication
- **Logout**: Click user menu → Sign Out

> **Note**: In production, you would integrate a real authentication service like Firebase, Auth0, or your own backend API.

---

## 💰 Finance Calculations

The payment simulator uses standard amortization formulas:

### Financing Formula

```
M = P[r(1+r)^n]/[(1+r)^n-1]

Where:
  M = Monthly payment
  P = Principal (amount financed)
  r = Monthly interest rate (APR / 12 / 100)
  n = Number of payments
```

**Example Test Case:**
- MSRP: $30,000
- Down payment: $3,000
- APR: 5.5%
- Term: 60 months
- **Expected monthly: ~$513.45**
- **Total paid: ~$30,807**
- **Total interest: ~$3,807**

### Leasing Formula

```
Monthly Payment = Depreciation Fee + Finance Fee

Depreciation Fee = (Adjusted Cap Cost - Residual Value) / Term
Finance Fee = (Adjusted Cap Cost + Residual Value) × Money Factor

Money Factor = APR / 2400
```

---

## ♿ Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Focus visible styles on all interactive elements
- ✅ Reduced motion support via `prefers-reduced-motion`
- ✅ Sufficient color contrast ratios
- ✅ Form labels and error messages

---

## 🌐 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📝 Known Limitations

1. **Frontend-Only**: All data is client-side. No backend API or database.
2. **Mock Authentication**: Authentication is simulated with localStorage.
3. **API Key Security**: Gemini API key stored in localStorage (not production-safe).
4. **Vehicle Images**: Using placeholder images from Unsplash.
5. **No Real Data**: Vehicle pricing and specs are realistic but not live from Toyota.
6. **Payment Estimates**: Simplified calculations for demonstration purposes.

---

## 🚀 Future Enhancements

- [ ] Backend API for vehicle data and user profiles
- [ ] Real authentication with JWT/OAuth
- [ ] Real-time pricing from Toyota API
- [ ] Dealer locator integration
- [ ] Test drive scheduling
- [ ] Vehicle comparison tool (side-by-side)
- [ ] Favorite/bookmark vehicles
- [ ] Email quote requests
- [ ] Social sharing
- [ ] Advanced analytics
- [ ] Multi-language support

---

## 📄 License

This is a demonstration project created for educational purposes. Not affiliated with Toyota Motor Corporation.

---

## 🙏 Contributing

This is a demonstration project, but feedback and suggestions are welcome!

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

<div align="center">

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Framer Motion**

[⬆ Back to Top](#-toyota-nexus)

</div>
