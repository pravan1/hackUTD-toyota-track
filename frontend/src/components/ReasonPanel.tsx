import { Check, Zap, Compass } from 'lucide-react';
import Card from './ui/Card';
import type { Vehicle } from '../types/vehicle';
import type { UserVehicleProfile } from '../store/profile';

interface ReasonPanelProps {
  vehicle: Vehicle;
  profile?: UserVehicleProfile;
}

interface Reason {
  icon: typeof Check;
  text: string;
  highlight?: boolean;
}

const normalizeFuelType = (fuel?: string) => {
  if (!fuel) return 'Gasoline';
  if (fuel === 'EV') return 'Electric';
  return fuel;
};

const prefersFuelType = (profile?: UserVehicleProfile, fuel?: string) => {
  if (!profile?.prefFuel?.length) return false;
  const normalized = normalizeFuelType(fuel);
  return profile.prefFuel.map(normalizeFuelType).includes(normalized);
};

function generateReasons(vehicle: Vehicle, profile?: UserVehicleProfile): Reason[] {
  const reasons: Reason[] = [];
  const drivetrain = (vehicle.drivetrain || '').toUpperCase();
  const fuelType = normalizeFuelType(vehicle.fuelType);

  if (profile) {
    if (profile.primaryUse === 'family' && (vehicle.bodyStyle === 'SUV' || vehicle.bodyStyle === 'Crossover')) {
      reasons.push({
        icon: Check,
        text: 'Spacious crossover setup keeps family and cargo comfortable',
        highlight: true
      });
    }

    if (profile.primaryUse === 'commuter' && (vehicle.bodyStyle === 'Sedan' || vehicle.bodyStyle === 'Crossover')) {
      reasons.push({
        icon: Check,
        text: 'Sized right for daily commuting with easy maneuverability',
        highlight: true
      });
    }

    if (profile.primaryUse === 'outdoor' && drivetrain.match(/AWD|4WD/)) {
      reasons.push({
        icon: Compass,
        text: 'Trail-ready traction matches your weekend adventures',
        highlight: true
      });
    }

    if (profile.primaryUse === 'eco_urban' && (fuelType === 'Hybrid' || fuelType === 'Electric')) {
      reasons.push({
        icon: Zap,
        text: 'Efficient hybrid-electrified powertrain fits your eco-first mindset',
        highlight: true
      });
    }

    if (profile.needs4WD && drivetrain.match(/AWD|4WD/)) {
      reasons.push({
        icon: Compass,
        text: 'All-wheel confidence for slippery or rough conditions',
        highlight: true
      });
    }

    if (profile.needsCompact && (vehicle.bodyStyle === 'Sedan' || vehicle.bodyStyle === 'Crossover')) {
      reasons.push({
        icon: Check,
        text: 'Compact-friendly footprint keeps parking stress low'
      });
    }

    if (profile.seatNeed >= 4 && vehicle.seats >= profile.seatNeed) {
      reasons.push({
        icon: Check,
        text: `Seats ${vehicle.seats} passengers — enough for your crew`
      });
    }

    if (profile.cargoNeed >= 4 && (vehicle.bodyStyle === 'SUV' || vehicle.bodyStyle === 'Truck')) {
      reasons.push({
        icon: Check,
        text: 'Flexible cargo area ready for gear, strollers, or weekend hauls'
      });
    }

    if (prefersFuelType(profile, vehicle.fuelType)) {
      reasons.push({
        icon: Zap,
        text: `Aligned with your preference for ${fuelType.toLowerCase()} power`
      });
    }

    if (
      profile.vehicleNeedsTags?.includes('future_tech') &&
      (fuelType === 'Electric' ||
        (vehicle.features || []).some((feature) =>
          /digital|12\.3|advanced park|hands-free/i.test(feature)
        ))
    ) {
      reasons.push({
        icon: Zap,
        text: 'Tech-forward cabin delivers the digital experience you asked for'
      });
    }

    if (
      profile.vehicleNeedsTags?.includes('family_space') &&
      (vehicle.bodyStyle === 'SUV' || vehicle.bodyStyle === 'Crossover')
    ) {
      reasons.push({
        icon: Check,
        text: 'Extra-wide cabin and rear access make family logistics easy'
      });
    }

    if (
      profile.vehicleNeedsTags?.includes('off_road') &&
      vehicle.bodyStyle === 'Truck'
    ) {
      reasons.push({
        icon: Compass,
        text: 'Trail hardware and truck stance match your off-road wish list'
      });
    }
  }

  if ((vehicle.fuelType === 'Hybrid' || fuelType === 'Electric') && !reasons.some((reason) => reason.icon === Zap)) {
    const mpgCopy = vehicle.fuelType === 'Hybrid'
      ? `Hybrid power: ${vehicle.mpgCity}/${vehicle.mpgHighway} MPG (city/highway)`
      : 'All-electric propulsion with zero tailpipe emissions';
    reasons.push({
      icon: Zap,
      text: mpgCopy
    });
  }

  if (!reasons.length) {
    reasons.push({
      icon: Check,
      text: 'Balanced Toyota engineering with safety, comfort, and reliability'
    });
  }

  const standoutFeature = vehicle.features?.find((feature) =>
    /safety|carplay|digital|premium audio|hands-free/i.test(feature)
  );

  if (standoutFeature) {
    reasons.push({
      icon: Check,
      text: `Highlights include: ${standoutFeature}`
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
