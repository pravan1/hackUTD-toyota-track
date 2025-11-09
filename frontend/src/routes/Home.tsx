import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Calculator, MessageSquare, Award, Search, Zap } from 'lucide-react';
import Hero from '../components/layout/Hero';
import FeatureCard from '../components/layout/FeatureCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { formatCurrency } from '../lib/finance';
import { motion } from 'framer-motion';
import { fetchVehicles } from '../lib/api';
import type { Vehicle } from '../types/vehicle';

export default function Home() {
  const [featured, setFeatured] = useState<Vehicle[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await fetchVehicles({ limit: 3, fuelType: 'Hybrid' });
        setFeatured(response.data);
      } catch (error) {
        console.error('Failed to load featured vehicles', error);
      }
    };

    loadFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Find Your Perfect Toyota"
        subtitle="Personalized recommendations powered by intelligent matching. Discover the ideal vehicle for your lifestyle and budget."
      >
        <div className="flex flex-wrap gap-4 mt-8">
          <Link to="/app/quiz">
            <Button size="lg">
              <Compass className="w-5 h-5 mr-2" />
              Take the Quiz
            </Button>
          </Link>
          <Link to="/app/explore">
            <Button variant="outline" size="lg">
              <Search className="w-5 h-5 mr-2" />
              Explore All Vehicles
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-toyota-black mb-4">
              How Toyota Nexus Works
            </h2>
            <p className="text-lg text-toyota-gray-dark max-w-2xl mx-auto">
              Three simple steps to find your ideal vehicle match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Compass}
              title="1. Take the Quiz"
              description="Answer a few quick questions about your budget, lifestyle, and preferences to help us understand your needs."
              delay={0}
            />
            <FeatureCard
              icon={Calculator}
              title="2. See Your Matches"
              description="Get personalized vehicle recommendations with detailed payment breakdowns for both financing and leasing options."
              delay={0.1}
            />
            <FeatureCard
              icon={MessageSquare}
              title="3. Ask Questions"
              description="Chat with our AI assistant to compare vehicles, explore features, and get answers to your questions."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-toyota-gray-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-toyota-black mb-4">
              Featured Vehicles
            </h2>
            <p className="text-lg text-toyota-gray-dark">
              Popular picks for eco-conscious drivers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((vehicle, index) => (
              <motion.div
                key={vehicle._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/app/vehicle/${vehicle._id}`}>
                  <Card hover padding="none" className="overflow-hidden h-full">
                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.year} ${vehicle.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-toyota-black mb-2">
                        {vehicle.year} {vehicle.model}{' '}
                        {vehicle.trim ? `• ${vehicle.trim}` : ''}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-toyota-gray-dark">Starting at</div>
                          <div className="text-xl font-bold text-toyota-red">
                            {formatCurrency(vehicle.price)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <Zap className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {vehicle.fuelType === 'EV'
                              ? 'Electric Range'
                              : `${vehicle.mpgCity}/${vehicle.mpgHighway} MPG`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/app/explore">
              <Button variant="outline">View All Vehicles</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-toyota-black mb-4">
              Why Toyota Nexus?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FeatureCard
              icon={Award}
              title="Personalized Matching"
              description="Our intelligent system learns your preferences and matches you with vehicles that truly fit your lifestyle."
            />
            <FeatureCard
              icon={Calculator}
              title="Transparent Pricing"
              description="See real payment estimates for financing and leasing with adjustable terms and rates."
            />
            <FeatureCard
              icon={MessageSquare}
              title="AI-Powered Chat"
              description="Get instant answers to your questions and compare vehicles with our smart chatbot assistant."
            />
            <FeatureCard
              icon={Zap}
              title="Eco-Friendly Options"
              description="Explore hybrid and electric vehicles to reduce your carbon footprint and save on fuel."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-toyota-red to-toyota-red-dark text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Take our quick quiz to get personalized vehicle recommendations tailored to your needs.
          </p>
          <Link to="/app/quiz">
            <Button variant="secondary" size="lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
