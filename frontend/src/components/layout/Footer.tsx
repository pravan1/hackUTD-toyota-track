import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-toyota-black text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-toyota-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-bold">
                Toyota <span className="text-toyota-red">Nexus</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Your intelligent vehicle recommendation assistant. Find the perfect Toyota vehicle tailored to your lifestyle and budget.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/app" className="text-sm text-gray-400 hover:text-white transition-colors focus-ring rounded">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/app/explore" className="text-sm text-gray-400 hover:text-white transition-colors focus-ring rounded">
                  Explore Vehicles
                </Link>
              </li>
              <li>
                <Link to="/app/quiz" className="text-sm text-gray-400 hover:text-white transition-colors focus-ring rounded">
                  Find My Match
                </Link>
              </li>
              <li>
                <Link to="/app/about" className="text-sm text-gray-400 hover:text-white transition-colors focus-ring rounded">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors focus-ring rounded"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors focus-ring rounded"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@toyotanexus.com"
                className="text-gray-400 hover:text-white transition-colors focus-ring rounded"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Toyota Nexus. Frontend demonstration project.</p>
          <p className="mt-2">
            This is a proof-of-concept application. Not affiliated with Toyota Motor Corporation.
          </p>
        </div>
      </div>
    </footer>
  )
}
