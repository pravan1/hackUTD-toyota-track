import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, LogIn } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center">
      {/* Subtle background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-toyota-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-toyota-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-20 h-20 mx-auto mb-4">
              <img
                src="/toyota_logo_signup.png"
                alt="Toyota Nexus"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-toyota-black mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in securely with your Auth0 account
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error.message}</span>
            </div>
          )}

          <Button
            fullWidth
            size="lg"
            disabled={isLoading}
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { prompt: 'login' }
              })
            }
            className="!py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In with Auth0
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Need an account?{' '}
            <Link
              to="/signup"
              className="text-toyota-red hover:text-red-600 font-medium"
            >
              Create one
            </Link>
          </div>
        </div>

        {/* Back to landing */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-toyota-black text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
