import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useProfileStore } from '../store/profile';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatCurrency } from '../lib/finance';
import { getGeminiRecommendations } from '../lib/api';
import type { Vehicle } from '../types/vehicle';

export default function QuizResults() {
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendationText, setRecommendationText] = useState<string>('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (!profile.completed) {
      navigate('/app/quiz');
      return;
    }

    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getAccessTokenSilently();
        const response = await getGeminiRecommendations(token);
        setRecommendationText(response.recommendations);
        setVehicles(response.vehicles);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load recommendations right now.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [getAccessTokenSilently, navigate, profile.completed]);

  if (!profile.completed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white">
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container-custom max-w-4xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-toyota-black mb-4">
            We Found Your Toyota Matches
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your preferences and Gemini's insight, here are the vehicles to explore next.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom max-w-4xl space-y-8">
          {loading && (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="w-8 h-8 animate-spin text-toyota-red" />
              <p className="text-toyota-gray-dark text-sm">
                Crafting your personalized Toyota shortlist...
              </p>
            </div>
          )}

          {error && (
            <Card padding="lg" className="bg-red-50 border border-red-200 text-red-700">
              <h2 className="text-xl font-semibold mb-2">Unable to fetch recommendations</h2>
              <p className="text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => navigate('/app/quiz')}>
                Adjust Preferences
              </Button>
            </Card>
          )}

          {!loading && !error && (
            <>
              <Card padding="lg">
                <h2 className="text-2xl font-bold text-toyota-black mb-4">
                  Gemini's Take
                </h2>
                <p className="text-toyota-gray-dark whitespace-pre-line leading-relaxed">
                  {recommendationText}
                </p>
              </Card>

              <div className="space-y-6">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle._id} padding="none" className="overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative h-64 md:h-full">
                        <img
                          src={vehicle.imageUrl}
                          alt={`${vehicle.year} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex gap-2 mb-3">
                            <Badge variant="info">{vehicle.fuelType}</Badge>
                            <Badge>{vehicle.bodyStyle}</Badge>
                        </div>
                          <h3 className="text-2xl font-bold text-toyota-black mb-2">
                            {vehicle.year} {vehicle.model}{' '}
                            {vehicle.trim ? `• ${vehicle.trim}` : ''}
                          </h3>
                          <p className="text-sm text-toyota-gray-dark mb-4">
                            {vehicle.fuelType === 'EV'
                              ? 'All-electric Toyota experience with cutting-edge tech.'
                              : `Delivers ${vehicle.mpgCity}/${vehicle.mpgHighway} MPG (city/highway) with ${vehicle.drivetrain}.`}
                          </p>
                          <div className="text-lg font-semibold text-toyota-red mb-4">
                            {formatCurrency(vehicle.price)}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {vehicle.features.slice(0, 4).map((feature) => (
                              <Badge
                                key={feature}
                                className="bg-white border border-gray-200 text-toyota-black"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Link to={`/app/vehicle/${vehicle._id}`}>
                          <Button className="mt-6" fullWidth>
                            View Details
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Want to explore the lineup further?
                </p>
                <Link to="/app/explore">
                  <Button variant="outline" size="lg">
                    Browse All Toyota Vehicles
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

