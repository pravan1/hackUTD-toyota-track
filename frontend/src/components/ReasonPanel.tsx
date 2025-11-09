import { Check, Zap, Compass } from 'lucide-react';
import Card from './ui/Card';
import type { Vehicle } from '../types/vehicle';
import type { UserProfile } from '../store/profile';

interface ReasonPanelProps {
  vehicle: Vehicle;
  profile?: UserProfile;
}

interface Reason {
  icon: typeof Check;
  text: string;
  highlight?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);

const estimateMonthlyPayment = (price: number) =>
  Math.round((price * 0.9) / 60); // approx 10% down, 60-month term

function generateReasons(vehicle: Vehicle, profile?: UserProfile): Reason[] {
  const reasons: Reason[] = [];

  if (profile?.completed) {
    const estimatedMonthly = estimateMonthlyPayment(vehicle.price);
    if (estimatedMonthly <= profile.budgetMonthly) {
      reasons.push({
        icon: Check,
        text: `Estimated payment around ${formatCurrency(
          estimatedMonthly
        )}/mo fits your $${profile.budgetMonthly}/mo target`,
        highlight: true
      });
    } else if (estimatedMonthly <= profile.budgetMonthly * 1.15) {
      reasons.push({
        icon: Check,
        text: `Estimated payment roughly ${formatCurrency(
          estimatedMonthly
        )}/mo — just above your target`,
        highlight: false
      });
    }
  }

  if (vehicle.fuelType === 'Hybrid' || vehicle.fuelType === 'EV') {
    reasons.push({
      icon: Zap,
      text:
        vehicle.fuelType === 'EV'
          ? 'All-electric driving with zero tailpipe emissions'
          : `Hybrid powertrain delivering up to ${vehicle.mpgCity}/${vehicle.mpgHighway} MPG`,
      highlight: vehicle.fuelType === 'EV'
    });
  } else if (vehicle.mpgCity >= 25) {
    reasons.push({
      icon: Check,
      text: `Balanced efficiency at ${vehicle.mpgCity}/${vehicle.mpgHighway} MPG (city/highway)`
    });
  }

  if (
    profile &&
    profile.preferredBodyStyle !== 'any' &&
    vehicle.bodyStyle === profile.preferredBodyStyle
  ) {
    reasons.push({
      icon: Check,
      text: `Matches your preferred ${vehicle.bodyStyle.toLowerCase()} body style`,
      highlight: true
    });
  }

  if (vehicle.seats >= 7) {
    reasons.push({
      icon: Check,
      text: `Room for the family with seating for ${vehicle.seats} passengers`
    });
  } else if (vehicle.seats === 5) {
    reasons.push({
      icon: Check,
      text: 'Comfortable seating for five with flexible cargo space'
    });
  }

  if (profile?.lifestyleTags.includes('adventure') && vehicle.drivetrain.includes('AWD')) {
    reasons.push({
      icon: Compass,
      text: 'All-wheel drive confidence for weekend adventures',
      highlight: true
    });
  }

  const standoutFeature = vehicle.features.find((feature) =>
    feature.toLowerCase().includes('safety') ||
    feature.toLowerCase().includes('carplay') ||
    feature.toLowerCase().includes('premium audio')
  );

  if (standoutFeature) {
    reasons.push({
      icon: Check,
      text: `Includes standout feature: ${standoutFeature}`
    });
  }

  if (reasons.length < 3 && vehicle.features.length > 0) {
    reasons.push({
      icon: Check,
      text: `Packed with Toyota Safety Sense and features like ${vehicle.features[0]}`
    });
  }

  return reasons.slice(0, 5);
}

export default function ReasonPanel({ vehicle, profile }: ReasonPanelProps) {
  const reasons = generateReasons(vehicle, profile);

  if (reasons.length === 0) {
    return null;
  }

  return (
    <Card padding="lg">
      <h3 className="text-xl font-semibold text-toyota-black mb-4">
        Why This Vehicle Fits You
      </h3>
      <ul className="space-y-3">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                reason.highlight
                  ? 'bg-toyota-red text-white'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              <reason.icon className="w-4 h-4" />
            </div>
            <span
              className={`text-sm leading-relaxed ${
                reason.highlight
                  ? 'font-medium text-toyota-black'
                  : 'text-toyota-gray-dark'
              }`}
            >
              {reason.text}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
