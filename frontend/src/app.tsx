import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import Chatbot from './components/Chatbot';
import LoadingScreen from './components/LoadingScreen';

// Public routes
import Landing from './routes/Landing';
import Login from './routes/Login';
import Signup from './routes/Signup';

// Protected routes
import Home from './routes/Home';
import Explore from './routes/Explore';
import VehicleDetail from './routes/VehicleDetail';
import ProfileQuiz from './routes/ProfileQuiz';
import QuizResults from './routes/QuizResults';
import About from './routes/About';

// Protected route wrapper
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-toyota-gray-dark">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
}

// Layout wrapper with navigation and footer (for authenticated users)
function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

// Animated page wrapper
function AnimatedOutlet() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

// Main app component with routing
export default function App() {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && (
          <LoadingScreen
            onComplete={() => setShowLoading(false)}
            duration={2000}
          />
        )}
      </AnimatePresence>

      {!showLoading && (
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route element={<AnimatedOutlet />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="vehicle/:id" element={<VehicleDetail />} />
              <Route path="quiz" element={<ProfileQuiz />} />
              <Route path="quiz-results" element={<QuizResults />} />
              <Route path="about" element={<About />} />
            </Route>
          </Route>

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
}
