import { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  ArrowLeft,
  Users,
  Zap,
  Award,
  Gauge,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfileStore } from '../store/profile';
import { formatCurrency } from '../lib/finance';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ReasonPanel from '../components/ReasonPanel';
import PaymentBreakdown from '../components/PaymentBreakdown';
import {
  fetchVehicleById,
  getVehicleSummary,
  type GeminiSummaryResponse
} from '../lib/api';
import type { Vehicle } from '../types/vehicle';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const { getAccessTokenSilently } = useAuth0();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await fetchVehicleById(id);
        setVehicle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load vehicle');
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  const handleSummary = async () => {
    if (!vehicle) return;
    try {
      setSummaryLoading(true);
      setSummaryError(null);
      const token = await getAccessTokenSilently();
      const response: GeminiSummaryResponse = await getVehicleSummary(
        token,
        vehicle._id
      );
      setSummary(response.summary);
    } catch (err) {
      setSummaryError(
        err instanceof Error ? err.message : 'Unable to fetch summary'
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-toyota-red" />
      </div>
    );
  }

  if (error || !vehicle) {
    return <Navigate to="/app/explore" replace />;
  }

  const displayName = `${vehicle.year} ${vehicle.model}${
    vehicle.trim ? ` ${vehicle.trim}` : ''
  }`;

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="bg-toyota-gray-light border-b border-gray-200">
        <div className="container-custom py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Button>
        </div>
      </div>

      {/* Vehicle Header */}
      <section className="py-12 bg-toyota-gray-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card padding="none" className="overflow-hidden">
                <img
                  src={vehicle.imageUrl}
                  alt={displayName}
                  className="w-full h-96 object-cover"
                />
              </Card>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={vehicle.fuelType === 'EV' ? 'success' : 'info'}>
                  {vehicle.fuelType}
                </Badge>
                <Badge>{vehicle.bodyStyle}</Badge>
                <Badge>{vehicle.drivetrain}</Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-toyota-black mb-4">
                {displayName}
              </h1>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-toyota-gray-dark mb-1">Starting MSRP</div>
                  <div className="text-3xl font-bold text-toyota-red">
                    {formatCurrency(vehicle.price)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-toyota-gray-dark mb-1">Fuel Economy</div>
                  <div className="text-2xl font-bold text-toyota-black flex items-center gap-2">
                    <Zap className="w-6 h-6 text-green-600" />
                    {vehicle.fuelType === 'EV'
                      ? 'Electric driving range ~250 mi'
                      : `${vehicle.mpgCity}/${vehicle.mpgHighway} MPG (city/highway)`}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/app/quiz">
                  <Button size="lg">Get Personalized Match</Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSummary}
                  disabled={summaryLoading}
                >
                  {summaryLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Requesting AI Summary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get AI Summary
                    </>
                  )}
                </Button>
              </div>

              {summaryError && (
                <div className="mt-4 text-sm text-red-600">
                  {summaryError}
                </div>
              )}

              {summary && (
                <Card padding="md" className="mt-6 bg-toyota-gray-light">
                  <h3 className="text-lg font-semibold text-toyota-black mb-2">
                    Gemini Insight
                  </h3>
                  <p className="text-sm text-toyota-gray-dark whitespace-pre-line">
                    {summary}
                  </p>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Specs */}
              <Card padding="lg">
                <h2 className="text-2xl font-semibold text-toyota-black mb-6">
                  Key Specifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-toyota-red/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-toyota-red" />
                    </div>
                    <div className="text-2xl font-bold text-toyota-black">{vehicle.seats}</div>
                    <div className="text-sm text-toyota-gray-dark">Passengers</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-toyota-black">
                      {vehicle.fuelType === 'EV' ? 'EV' : `${vehicle.mpgCity}`}
                    </div>
                    <div className="text-sm text-toyota-gray-dark">
                      {vehicle.fuelType === 'EV' ? 'Zero Emissions' : 'City MPG'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Gauge className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-toyota-black">
                      {vehicle.fuelType === 'EV'
                        ? vehicle.drivetrain.includes('AWD')
                          ? 'AWD'
                          : 'FWD'
                        : vehicle.mpgHighway}
                    </div>
                    <div className="text-sm text-toyota-gray-dark">
                      {vehicle.fuelType === 'EV' ? 'Drivetrain' : 'Highway MPG'}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Features */}
              <Card padding="lg">
                <h2 className="text-2xl font-semibold text-toyota-black mb-6">
                  Standard Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicle.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-toyota-red flex-shrink-0 mt-0.5" />
                      <span className="text-toyota-gray-dark">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Reason Panel */}
              {profile.completed && <ReasonPanel vehicle={vehicle} profile={profile} />}

              {/* Payment Breakdown */}
              <PaymentBreakdown vehicle={vehicle} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
