import Hero from '../components/layout/Hero'
import Card from '../components/ui/Card'
import { Lightbulb, Target, Shield, Heart } from 'lucide-react'

export default function About() {
  return (
    <div>
      <Hero
        title="About Toyota Nexus"
        subtitle="Helping you make confident vehicle decisions with personalized recommendations and transparent information"
        compact
      />

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          {/* Mission */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-toyota-black mb-6 text-center">
              Our Mission
            </h2>
            <Card padding="lg">
              <p className="text-lg text-toyota-gray-dark leading-relaxed text-center">
                Toyota Nexus is designed to simplify the vehicle shopping experience by providing
                personalized recommendations based on your unique needs, lifestyle, and budget.
                We believe that finding the right vehicle shouldn't be overwhelming—it should be
                empowering and enjoyable.
              </p>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-toyota-black mb-8 text-center">
              What We Stand For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-toyota-red/10 rounded-lg flex-shrink-0">
                    <Target className="w-6 h-6 text-toyota-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      Personalization
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Every driver is unique. Our intelligent matching system learns your
                      preferences to recommend vehicles that truly fit your lifestyle.
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-toyota-red/10 rounded-lg flex-shrink-0">
                    <Shield className="w-6 h-6 text-toyota-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      Transparency
                    </h3>
                    <p className="text-toyota-gray-dark">
                      No hidden fees or surprises. See accurate payment estimates with full
                      breakdowns for both financing and leasing options.
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-toyota-red/10 rounded-lg flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-toyota-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      Innovation
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Leveraging AI and modern technology to provide instant answers and
                      intelligent recommendations at your fingertips.
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-toyota-red/10 rounded-lg flex-shrink-0">
                    <Heart className="w-6 h-6 text-toyota-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      User-First
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Built with your needs in mind. Accessible, easy to use, and designed
                      to help you make confident decisions.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-toyota-black mb-8 text-center">
              How It Works
            </h2>
            <Card padding="lg">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-toyota-red text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-toyota-black mb-1">
                      Complete the Profile Quiz
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Answer 6 quick questions about your budget, driving habits, and lifestyle
                      preferences to help us understand what matters to you.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-toyota-red text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-toyota-black mb-1">
                      Get Personalized Matches
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Browse our complete lineup with filters tailored to your preferences.
                      See why each vehicle is a good fit based on your profile.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-toyota-red text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-toyota-black mb-1">
                      Explore Payment Options
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Use our interactive payment simulator to see financing and leasing
                      estimates with adjustable terms, rates, and down payments.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-toyota-red text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-toyota-black mb-1">
                      Ask the AI Assistant
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Have questions? Chat with our AI-powered assistant to compare vehicles,
                      get recommendations, or learn more about features and options.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card padding="lg" className="bg-toyota-gray-light border-0">
            <h3 className="font-semibold text-toyota-black mb-2">Important Note</h3>
            <p className="text-sm text-toyota-gray-dark">
              Toyota Nexus is a demonstration project showcasing modern web development practices
              and AI integration. This application is not affiliated with Toyota Motor Corporation.
              All vehicle information, pricing, and payment estimates are for demonstration
              purposes only and should not be used for actual purchasing decisions. Always consult
              with an authorized Toyota dealer for accurate, up-to-date information.
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
