import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, Car, DollarSign, Brain } from 'lucide-react'
import Button from '../components/ui/Button'
import { useState, useEffect } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const [displayedText, setDisplayedText] = useState('')
  const fullText = 'Transform your car buying experience with intelligent recommendations. Get personalized Toyota matches, smart financing options, and expert guidance tailored to your lifestyle and budget.'

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img
                src="/toyota_logo_signup.png"
                alt="Toyota Nexus"
                className="w-12 h-12 object-contain"
              />
              <span className="text-2xl font-bold text-toyota-black">
                Toyota <span className="text-toyota-red">Nexus</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="!text-toyota-black hover:!text-toyota-red"
              >
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 bg-gradient-to-br from-white via-red-50 to-white overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-toyota-red/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-toyota-red/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold text-toyota-black mb-8 leading-tight">
                Your Smart{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-toyota-red to-red-600">
                  Toyota Finder
                </span>
              </h1>

              <div className="min-h-[120px] mb-8">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {displayedText}
                  <span className="inline-block w-0.5 h-6 bg-toyota-red ml-1 animate-pulse" />
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="!px-8 !py-4 !text-lg bg-gradient-to-r from-toyota-red to-red-600 hover:from-red-600 hover:to-toyota-red"
                >
                  Try Toyota Nexus Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="!px-8 !py-4 !text-lg !border-2 !border-toyota-red !text-toyota-red hover:!bg-toyota-red hover:!text-white"
                >
                  Sign In
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3">
                {[
                  'Free to start',
                  'No setup required',
                  'Personalized recommendations'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-toyota-red flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-toyota-black">Why Toyota Nexus?</h3>
                  <img
                    src="/toyota_logo_signup.png"
                    alt="Toyota"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">AI Match Accuracy</span>
                      <span className="text-sm font-bold text-toyota-red">98%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-[98%] bg-gradient-to-r from-toyota-red to-red-600 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                      <span className="text-sm font-bold text-toyota-red">95%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-[95%] bg-gradient-to-r from-toyota-red to-red-600 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Time Saved</span>
                      <span className="text-sm font-bold text-toyota-red">87%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-[87%] bg-gradient-to-r from-toyota-red to-red-600 rounded-full" />
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-sm text-gray-600">
                  Join thousands of satisfied customers who found their perfect vehicle with our AI-powered platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-toyota-black mb-4">
              Why Choose <span className="text-toyota-red">Toyota Nexus</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology meets automotive excellence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-toyota-red to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-toyota-black mb-4">AI-Powered Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Our intelligent algorithm analyzes your preferences and lifestyle to recommend the perfect Toyota vehicle.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-toyota-red to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-toyota-black mb-4">Smart Financing</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized financing options and payment plans tailored to your budget and financial goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-toyota-red to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-toyota-black mb-4">Complete Vehicle Info</h3>
              <p className="text-gray-600 leading-relaxed">
                Access detailed specifications, features, and comparisons for every Toyota model in our database.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-toyota-red via-red-600 to-toyota-red-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Toyota?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands who discovered their ideal vehicle with Toyota Nexus
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/signup')}
            className="!bg-white !text-toyota-red hover:!bg-gray-100 !px-10 !py-5 !text-lg"
          >
            Get Started Free
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <img
                src="/toyota_logo_signup.png"
                alt="Toyota Nexus"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-toyota-black">
                Toyota <span className="text-toyota-red">Nexus</span>
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2024 Toyota Nexus. Your Intelligent Vehicle Assistant.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
