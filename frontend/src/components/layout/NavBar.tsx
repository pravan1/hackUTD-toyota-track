import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { clsx } from 'clsx';

const navLinks = [
  { href: '/app', label: 'Home' },
  { href: '/app/explore', label: 'Explore Vehicles' },
  { href: '/app/quiz', label: 'Find My Match' },
  { href: '/app/about', label: 'About' },
]

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, loginWithRedirect } = useAuth0();
  const displayName = user?.name || user?.nickname || user?.email || 'Account';

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout({
      logoutParams: { returnTo: window.location.origin }
    });
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/app"
            className="flex items-center gap-2 focus-ring rounded-md"
            aria-label="Toyota Nexus Home"
          >
            <div className="w-10 h-10">
              <img
                src="/toyota_logo_signup.png"
                alt="Toyota Nexus"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-toyota-black hidden sm:inline">
              Toyota <span className="text-toyota-red">Nexus</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  'text-sm font-medium transition-colors focus-ring rounded-md px-3 py-2',
                  isActive(link.href)
                    ? 'text-toyota-red'
                    : 'text-toyota-gray-dark hover:text-toyota-black'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-toyota-gray-light transition-colors focus-ring"
                  >
                    <div className="w-8 h-8 bg-toyota-red rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-toyota-black">
                      {displayName}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-toyota-gray-dark hover:bg-toyota-gray-light flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loginWithRedirect()}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'px-4 py-2 text-base font-medium rounded-md transition-colors focus-ring',
                    isActive(link.href)
                      ? 'bg-toyota-red/10 text-toyota-red'
                      : 'text-toyota-gray-dark hover:bg-toyota-gray-light hover:text-toyota-black'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile User Info */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-toyota-gray-dark">
                      Signed in as{' '}
                      <span className="font-medium text-toyota-black">
                        {displayName}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-base font-medium text-toyota-red hover:bg-toyota-red/10 rounded-md transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      loginWithRedirect();
                    }}
                    fullWidth
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
