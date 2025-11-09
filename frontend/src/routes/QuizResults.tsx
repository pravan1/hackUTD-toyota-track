import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ArrowRight, CheckCircle, Loader2, Sparkles } from 'lucide-react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Hero from '../components/layout/Hero';
import { formatCurrency } from '../lib/finance';
import { fetchVehicleProfile } from '../lib/api';
import { useProfileStore } from '../store/profile';
import type { VehicleRecommendation } from '../store/profile';

const PRIMARY_USE_COPY: Record<string, string> = {
  commuter: 'City & suburban commuter',
  family: 'Family hauler & kid taxi',
  outdoor: 'Weekend trail explorer',
  eco_urban: 'Eco-minded urban driver'
};

const STYLE_COPY: Record<string, string> = {
  sedan_lux: 'Sleek sedan sophistication',
  crossover_suv: 'Versatile crossover utility',
  truck_offroad: 'Trail-ready truck muscle',
  ev_tech: 'Futuristic EV vibe'
};

const BADGE_COPY: Record<VehicleRecommendation['badge'], string> = {
  best_match: 'Best Match',
  great_alternative: 'Great Alternative'
};

const formatList = (items?: string[]) =>
  items && items.length > 0 ? items.join(', ') : '—';

const RecommendationCard = ({
  recommendation,
  highlight = false
}: {
  recommendation: VehicleRecommendation;
  highlight?: boolean;
}) => {
  const { vehicle, summary, reasons, badge, score } = recommendation;
  const label = BADGE_COPY[badge];

  return (
    <Card padding="none" className={`overflow-hidden ${highlight ? 'border-toyota-red border-2 shadow-lg' : ''}`}>
      <div className="grid h-full gap-0 md:grid-cols-2">
        <div className="relative h-64 w-full md:h-full">
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.year} ${vehicle.model}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4">
            <Badge variant={highlight ? 'primary' : 'info'}>{label}</Badge>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-toyota-gray-dark">
            Score {Math.round(score)}
          </div>
        </div>
        <div className="flex h-full flex-col justify-between p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{vehicle.fuelType}</Badge>
              <Badge variant="outline">{vehicle.bodyStyle}</Badge>
              <Badge variant="outline">{vehicle.drivetrain}</Badge>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-toyota-black">
                {vehicle.year} {vehicle.model}
                {vehicle.trim ? ` • ${vehicle.trim}` : ''}
              </h3>
              <p className="mt-1 text-sm text-toyota-gray-dark leading-relaxed">
                {summary}
              </p>
            </div>
            <div className="text-lg font-semibold text-toyota-red">
              {formatCurrency(vehicle.price)}
            </div>
            {reasons.length > 0 && (
              <ul className="space-y-2 rounded-lg bg-toyota-gray-light/60 p-3 text-sm text-toyota-gray-dark">
                {reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-toyota-red" />
                    <span>{reason.charAt(0).toUpperCase() + reason.slice(1)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link to={`/app/vehicle/${vehicle._id}`} className="mt-6">
            <Button fullWidth>
              Explore {vehicle.model}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default function QuizResults() {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const {
    vehicleProfile,
    geminiProfile,
    frqResponses,
    recommendations,
    completed,
    setQuizResult
  } = useProfileStore();

  const [loading, setLoading] = useState(recommendations.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recommendations.length > 0) return;

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getAccessTokenSilently();
        const result = await fetchVehicleProfile(token);
        if (cancelled) return;
        if (!result.profile) {
          navigate('/app/quiz');
          return;
        }
        setQuizResult(result);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to load your recommendations right now.';
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [recommendations.length, getAccessTokenSilently, navigate, setQuizResult]);

  useEffect(() => {
    if (!completed && !loading && !error && recommendations.length === 0) {
      navigate('/app/quiz');
    }
  }, [completed, loading, error, navigate, recommendations.length]);

  const bestMatch = recommendations[0];
  const alternatives = recommendations.slice(1);

  const profileSnapshot = useMemo(() => {
    if (!vehicleProfile) return null;
    return {
      primaryUse: PRIMARY_USE_COPY[vehicleProfile.primaryUse] || 'Personalized driver',
      fuelPref: vehicleProfile.prefFuel.join(', '),
      style: STYLE_COPY[vehicleProfile.style] || 'Tailored fit',
      budget: vehicleProfile.budgetSensitivity >= 4
        ? 'Very budget conscious'
        : vehicleProfile.budgetSensitivity <= 2
          ? 'Flexible on payments'
          : 'Balanced budget approach'
    };
  }, [vehicleProfile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white">
      <Hero
        title="Your Toyota Matchmaking Results"
        subtitle="We turned your quiz + story into a personal vehicle profile. Here’s how the lineup stacks up for you."
        compact
      />

      <section className="py-12">
        <div className="container-custom max-w-5xl space-y-8">
          {loading && (
            <div className="flex flex-col items-center gap-4 py-16">
              <Loader2 className="h-10 w-10 animate-spin text-toyota-red" />
              <p className="text-sm text-toyota-gray-dark">
                Scoring your answers against the Toyota garage...
              </p>
            </div>
          )}

          {error && !loading && (
            <Card padding="lg" className="border border-red-200 bg-red-50 text-red-700">
              <h2 className="text-xl font-semibold mb-2">Unable to load your matches</h2>
              <p className="text-sm mb-4">
                {error}
              </p>
              <Button variant="outline" onClick={() => navigate('/app/quiz')}>
                Retake the quiz
              </Button>
            </Card>
          )}

          {!loading && !error && recommendations.length > 0 && bestMatch && (
            <>
              <Card padding="lg" className="border border-green-200 bg-white">
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wide text-green-700">
                        Personalized Toyota Lead
                      </p>
                      <h2 className="text-3xl font-bold text-toyota-black">
                        We think you’ll love the {bestMatch.vehicle.model}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-toyota-gray-dark">
                    <Sparkles className="h-5 w-5 text-toyota-red" />
                    <span>Matched using your lifestyle, priorities & story</span>
                  </div>
                </div>
              </Card>

              <RecommendationCard recommendation={bestMatch} highlight />

              {alternatives.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-toyota-black">
                    Great Alternatives
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {alternatives.map((rec) => (
                      <RecommendationCard key={`${rec.vehicle._id}-${rec.rank}`} recommendation={rec} />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <Card padding="lg" className="space-y-4">
                  <h3 className="text-xl font-semibold text-toyota-black">Profile Snapshot</h3>
                  {profileSnapshot ? (
                    <ul className="space-y-3 text-sm text-toyota-gray-dark">
                      <li>
                        <strong className="text-toyota-black">Primary vibe:</strong> {profileSnapshot.primaryUse}
                      </li>
                      <li>
                        <strong className="text-toyota-black">Preferred energy:</strong> {profileSnapshot.fuelPref || 'Open to all'}
                      </li>
                      <li>
                        <strong className="text-toyota-black">Style direction:</strong> {profileSnapshot.style}
                      </li>
                      <li>
                        <strong className="text-toyota-black">Budget feel:</strong> {profileSnapshot.budget}
                      </li>
                    </ul>
                  ) : (
                    <p className="text-sm text-toyota-gray-dark">
                      Complete the quiz to unlock your personalized snapshot.
                    </p>
                  )}
                </Card>

                <Card padding="lg" className="space-y-4">
                  <h3 className="text-xl font-semibold text-toyota-black">Story Signals</h3>
                  <div className="space-y-3 text-sm text-toyota-gray-dark">
                    <div>
                      <strong className="text-toyota-black">Life stage:</strong>{' '}
                      {geminiProfile?.lifeStage ?? '—'}
                    </div>
                    <div>
                      <strong className="text-toyota-black">Top goals:</strong>{' '}
                      {formatList(geminiProfile?.topGoals)}
                    </div>
                    <div>
                      <strong className="text-toyota-black">Vehicle needs:</strong>{' '}
                      {formatList(geminiProfile?.vehicleNeeds)}
                    </div>
                    <div>
                      <strong className="text-toyota-black">Key concerns:</strong>{' '}
                      {formatList(geminiProfile?.keyConcerns)}
                    </div>
                  </div>
                </Card>
              </div>

              {frqResponses && (
                <Card padding="lg" className="bg-white">
                  <h3 className="text-xl font-semibold text-toyota-black mb-3">
                    In your own words
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-toyota-red">Next chapter</p>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-toyota-gray-dark">
                        {frqResponses.lifeChapter || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-toyota-red">Stress & non-negotiables</p>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-toyota-gray-dark">
                        {frqResponses.stressNonNegotiables || '—'}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <div className="rounded-xl border border-toyota-red/40 bg-toyota-red/10 p-6 text-center">
                <p className="text-sm text-toyota-gray-dark">
                  Want to keep shopping?
                </p>
                <Link to="/app/explore">
                  <Button variant="outline" size="lg" className="mt-4">
                    Browse the Toyota lineup
                    <ArrowRight className="ml-2 h-4 w-4" />
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

