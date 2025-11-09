# 🚀 Toyota Nexus - Quick Start Guide

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:5173**

## 🎭 First Time Experience

1. **⚡ Loading Screen** (2 seconds)
   - Animated Toyota logo
   - Progress bar
   - Floating particles

2. **🌟 Landing Page**
   - **Aurora animations** with mouse tracking
   - Animated gradient blobs
   - Click **"Get Started"** or **"Sign In"**

3. **🔐 Sign Up**
   - Enter name, email, password (min 6 chars)
   - Password strength indicator
   - Creates mock account instantly

4. **🏠 Main App** (`/app`)
   - Explore vehicles
   - Take profile quiz
   - Use AI chatbot

## 🎯 Key Features

### Authentication
- **Sign Up**: Create account (mock - no real backend)
- **Login**: Use same email/password
- **Protected Routes**: Must be logged in to access `/app/*`
- **Logout**: User menu → Sign Out

### Landing Page Animations
- **Aurora Effect**: Background follows mouse movement
- **Gradient Blobs**: 3 animated blobs with blur effects
- **Floating Particles**: 30 animated dots
- **Smooth Transitions**: Framer Motion throughout

### Chatbot
- **MOCK Mode** (default): No API key needed
  - Try: "Best hybrids under $400/mo"
  - Try: "Compare Camry vs. Corolla"
  - Try: "Explain lease vs finance"

- **Gemini AI Mode** (optional):
  1. Click settings gear in chatbot
  2. Paste Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
  3. Select model
  4. Save

## 📂 Project Structure

```
src/
├── routes/
│   ├── Landing.tsx    # 🌟 Aurora landing page
│   ├── Login.tsx      # 🔐 Sign in
│   ├── Signup.tsx     # 🔐 Sign up
│   ├── Home.tsx       # Main app home
│   ├── Explore.tsx    # Vehicle browsing
│   └── ...
├── components/
│   ├── LoadingScreen.tsx  # ⚡ Initial loader
│   ├── Chatbot.tsx        # 🤖 AI assistant
│   └── ...
├── store/
│   ├── auth.ts        # 🔐 Authentication
│   └── profile.ts     # User preferences
└── app.tsx            # 🛣️ Routing + auth guards
```

## 🎨 Design System

### Colors
- **Primary Red**: `#EB0A1E`
- **Dark Red**: `#C00918`
- **Black**: `#1A1A1A`
- **Gray Light**: `#F5F5F5`

### Animations
- **Page Transitions**: Fade + slide (300ms)
- **Card Reveals**: Staggered (50ms delay)
- **Aurora**: 10-15s loop
- **Particles**: 3-6s float cycles

## 🔧 Build & Deploy

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

Build output in `dist/` folder.

## 💡 Tips

1. **First Login**: Any email + password (min 6 chars)
2. **Test Vehicle**: Check out "2024 Prius" for hybrid features
3. **Quiz**: Complete for personalized recommendations
4. **Chatbot**: Try quick suggestions at bottom
5. **Filters**: Use price slider + search on Explore page

## ⚠️ Known Issues

- Auth is mock (localStorage only)
- Vehicle images from Unsplash
- Payment calculations are simplified
- No real backend API

## 🎯 Demo Credentials

Since auth is mocked, use **any email and password**:
- Email: `demo@toyota.com`
- Password: `password`

---

**Enjoy Toyota Nexus!** 🚗✨
