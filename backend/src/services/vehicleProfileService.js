import Vehicle from '../models/Vehicle.js';

const PRIMARY_USE_MAP = {
  A: 'commuter',
  B: 'family',
  C: 'outdoor',
  D: 'eco_urban'
};

const Q2_MAP = {
  A: { ecoPriority: 3, prefFuel: ['Gasoline', 'Hybrid'] },
  B: { ecoPriority: 4, prefFuel: ['Hybrid'] },
  C: { ecoPriority: 5, prefFuel: ['Electric', 'Hybrid'] },
  D: { ecoPriority: 1, prefFuel: ['Gasoline'] }
};

const Q3_MAP = {
  A: { parkingTight: true, needsCompact: true },
  B: { needsHighwayComfort: true },
  C: { offRoadPriority: 5, needs4WD: true },
  D: { longRange: true }
};

const Q4_MAP = {
  A: { seatNeed: 2, cargoNeed: 2 },
  B: { seatNeed: 3, cargoNeed: 3 },
  C: { seatNeed: 5, cargoNeed: 4 },
  D: { seatNeed: 4, cargoNeed: 5 }
};

const STYLE_MAP = {
  A: 'sedan_lux',
  B: 'crossover_suv',
  C: 'truck_offroad',
  D: 'ev_tech'
};

const BUDGET_MAP = {
  A: 5,
  B: 3,
  C: 1
};

const SHOWCASE_VEHICLES = [
  {
    key: 'rav4-hybrid-xse',
    model: 'RAV4 Hybrid',
    trim: 'XSE',
    fallback: {
      _id: 'fallback-rav4-hybrid-xse',
      make: 'Toyota',
      model: 'RAV4 Hybrid',
      year: 2024,
      trim: 'XSE',
      price: 37185,
      fuelType: 'Hybrid',
      bodyStyle: 'SUV',
      transmission: 'E-CVT',
      drivetrain: 'AWD',
      mpgCity: 41,
      mpgHighway: 38,
      seats: 5,
      imageUrl:
        'https://toyota.scene7.com/is/image/toyota/rav4hybmy24_xse_cavalryblue?wid=1200',
      features: [
        'Sport-tuned suspension',
        'Two-tone exterior paint',
        'Digital rearview mirror',
        'Qi wireless charging',
        'Premium audio with 11 speakers'
      ]
    }
  },
  {
    key: 'camry-xle',
    model: 'Camry',
    trim: 'XLE',
    fallback: {
      _id: 'fallback-camry-xle',
      make: 'Toyota',
      model: 'Camry',
      year: 2025,
      trim: 'XLE',
      price: 33920,
      fuelType: 'Gasoline',
      bodyStyle: 'Sedan',
      transmission: '8-speed automatic',
      drivetrain: 'FWD',
      mpgCity: 28,
      mpgHighway: 39,
      seats: 5,
      imageUrl:
        'https://toyota.scene7.com/is/image/toyota/camrymy25_xle_windchillpearl?wid=1200',
      features: [
        'Toyota Safety Sense 3.0',
        '12.3-inch infotainment display',
        'Heated and ventilated front seats',
        'Power moonroof',
        'Wireless Apple CarPlay & Android Auto'
      ]
    }
  },
  {
    key: 'corolla-cross-xle-awd',
    model: 'Corolla Cross',
    trim: 'XLE AWD',
    fallback: {
      _id: 'fallback-corolla-cross-xle-awd',
      make: 'Toyota',
      model: 'Corolla Cross',
      year: 2024,
      trim: 'XLE AWD',
      price: 31500,
      fuelType: 'Gasoline',
      bodyStyle: 'Crossover',
      transmission: 'CVT',
      drivetrain: 'AWD',
      mpgCity: 29,
      mpgHighway: 32,
      seats: 5,
      imageUrl:
        'https://toyota.scene7.com/is/image/toyota/corollacrossmy24_xle_jetblack?wid=1200',
      features: [
        'AWD confidence',
        'Heated SofTex-trimmed seats',
        'Power liftgate',
        'Qi wireless charging',
        'Toyota Safety Sense 3.0'
      ]
    }
  },
  {
    key: 'tacoma-trd-off-road',
    model: 'Tacoma',
    trim: 'TRD Off-Road',
    fallback: {
      _id: 'fallback-tacoma-trd-off-road',
      make: 'Toyota',
      model: 'Tacoma',
      year: 2024,
      trim: 'TRD Off-Road',
      price: 40400,
      fuelType: 'Gasoline',
      bodyStyle: 'Truck',
      transmission: '8-speed automatic',
      drivetrain: '4WD',
      mpgCity: 19,
      mpgHighway: 24,
      seats: 5,
      imageUrl:
        'https://toyota.scene7.com/is/image/toyota/tacomamy24_trdoffroad_lunarrock?wid=1200',
      features: [
        'Bilstein shocks',
        'Multi-Terrain Select',
        'Crawl Control',
        'Composite bed with 120V outlet',
        'Locking rear differential'
      ]
    }
  },
  {
    key: 'bz4x-limited-awd',
    model: 'bZ4X',
    trim: 'Limited AWD',
    fallback: {
      _id: 'fallback-bz4x-limited-awd',
      make: 'Toyota',
      model: 'bZ4X',
      year: 2024,
      trim: 'Limited AWD',
      price: 47185,
      fuelType: 'Electric',
      bodyStyle: 'SUV',
      transmission: 'Single-speed',
      drivetrain: 'AWD',
      mpgCity: 0,
      mpgHighway: 0,
      seats: 5,
      imageUrl:
        'https://toyota.scene7.com/is/image/toyota/bz4xmy24_limited_elemental?wid=1200',
      features: [
        'Estimated 252-mile range',
        'Advanced Park assist',
        'Panoramic roof',
        'Heated and ventilated front seats',
        '12.3-inch Toyota Audio Multimedia'
      ]
    }
  }
];

const DEFAULT_PROFILE = {
  primaryUse: 'commuter',
  prefFuel: ['Gasoline'],
  ecoPriority: 3,
  parkingTight: false,
  needsCompact: false,
  needs4WD: false,
  offRoadPriority: 1,
  longRange: false,
  seatNeed: 2,
  cargoNeed: 2,
  style: 'crossover_suv',
  budgetSensitivity: 3,
  vehicleNeedsTags: [],
  keyConcerns: []
};

const fuelAliases = {
  EV: 'Electric',
  Electric: 'Electric',
  Hybrid: 'Hybrid',
  Gasoline: 'Gasoline'
};

const normalizeFuelType = (fuelType) => {
  if (!fuelType) return 'Gasoline';
  const normalized = fuelAliases[fuelType];
  return normalized || fuelType;
};

const titleCase = (text = '') =>
  text
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const dedupe = (array = []) => Array.from(new Set(array.filter(Boolean)));

export const mapMcqResponsesToProfile = (responses = {}) => {
  const profile = { ...DEFAULT_PROFILE };

  const q1 = responses.q1;
  if (PRIMARY_USE_MAP[q1]) {
    profile.primaryUse = PRIMARY_USE_MAP[q1];
  }

  const q2 = responses.q2;
  if (Q2_MAP[q2]) {
    profile.ecoPriority = Q2_MAP[q2].ecoPriority;
    profile.prefFuel = Q2_MAP[q2].prefFuel;
  }

  const q3 = responses.q3;
  if (Q3_MAP[q3]) {
    Object.assign(profile, Q3_MAP[q3]);
    if (Q3_MAP[q3].offRoadPriority) {
      profile.offRoadPriority = Q3_MAP[q3].offRoadPriority;
    }
  } else {
    profile.offRoadPriority = profile.offRoadPriority ?? 1;
  }

  const q4 = responses.q4;
  if (Q4_MAP[q4]) {
    profile.seatNeed = Q4_MAP[q4].seatNeed;
    profile.cargoNeed = Q4_MAP[q4].cargoNeed;
  }

  const q5 = responses.q5;
  if (STYLE_MAP[q5]) {
    profile.style = STYLE_MAP[q5];
  }

  const q6 = responses.q6;
  if (BUDGET_MAP[q6]) {
    profile.budgetSensitivity = BUDGET_MAP[q6];
  }

  return profile;
};

export const loadShowcaseInventory = async () => {
  const vehicles = await Vehicle.find({
    $or: SHOWCASE_VEHICLES.map((spec) => {
      const query = { model: spec.model };
      if (spec.trim) {
        query.trim = spec.trim;
      }
      return query;
    })
  }).lean();

  return SHOWCASE_VEHICLES.map((spec) => {
    const match = vehicles.find((vehicle) => {
      const modelMatches =
        vehicle.model?.toLowerCase() === spec.model.toLowerCase();
      const trimMatches = spec.trim
        ? vehicle.trim?.toLowerCase() === spec.trim.toLowerCase()
        : true;
      return modelMatches && trimMatches;
    });

    if (!match) {
      return spec.fallback;
    }

    return {
      ...match,
      fuelType: normalizeFuelType(match.fuelType)
    };
  });
};

const prefersFuelType = (profile, vehicleFuel) => {
  if (!profile.prefFuel?.length) return false;
  return profile.prefFuel
    .map((fuel) => normalizeFuelType(fuel))
    .includes(normalizeFuelType(vehicleFuel));
};

export const scoreCar = (profile, car) => {
  let score = 0;
  const bodyStyle = car.bodyStyle;
  const fuelType = normalizeFuelType(car.fuelType);
  const drivetrain = (car.drivetrain || '').toUpperCase();
  const msrp = car.price || car.msrp || 0;

  if (profile.primaryUse === 'family') {
    if (bodyStyle === 'SUV' || bodyStyle === 'Crossover') score += 25;
    if (car.model === 'Camry') score += 15;
  }

  if (profile.primaryUse === 'commuter') {
    if (bodyStyle === 'Sedan' || bodyStyle === 'Crossover') score += 20;
    if ((car.mpgCity || 0) >= 28) score += 10;
  }

  if (profile.primaryUse === 'outdoor') {
    if (bodyStyle === 'Truck') score += 30;
    if (drivetrain.includes('4WD') || drivetrain.includes('AWD')) score += 15;
  }

  if (profile.primaryUse === 'eco_urban') {
    if (fuelType === 'Electric' || fuelType === 'Hybrid') score += 30;
  }

  if (prefersFuelType(profile, fuelType)) score += 20;
  if (
    profile.ecoPriority >= 4 &&
    (fuelType === 'Hybrid' || fuelType === 'Electric')
  ) {
    score += 15;
  }

  if (
    profile.seatNeed >= 4 &&
    (bodyStyle === 'SUV' || bodyStyle === 'Crossover' || bodyStyle === 'Truck')
  ) {
    score += 15;
  }

  if (
    profile.cargoNeed >= 4 &&
    (bodyStyle === 'SUV' || bodyStyle === 'Truck')
  ) {
    score += 15;
  }

  if (
    profile.needs4WD &&
    (drivetrain.includes('4WD') || drivetrain.includes('AWD'))
  ) {
    score += 20;
  }

  if (
    profile.needsCompact &&
    (bodyStyle === 'Sedan' || bodyStyle === 'Crossover')
  ) {
    score += 10;
  }

  if (profile.style === 'sedan_lux' && bodyStyle === 'Sedan') score += 20;
  if (
    profile.style === 'crossover_suv' &&
    (bodyStyle === 'SUV' || bodyStyle === 'Crossover')
  )
    score += 20;
  if (profile.style === 'truck_offroad' && bodyStyle === 'Truck') score += 25;
  if (profile.style === 'ev_tech' && fuelType === 'Electric') score += 30;

  if (profile.budgetSensitivity >= 4) {
    if (msrp > 45000) score -= 20;
    if (msrp < 33000) score += 10;
  }

  const needs = profile.vehicleNeedsTags || [];
  if (
    needs.includes('family_space') &&
    (bodyStyle === 'SUV' || bodyStyle === 'Crossover')
  ) {
    score += 10;
  }

  if (needs.includes('off_road') && bodyStyle === 'Truck') {
    score += 15;
  }

  if (
    (needs.includes('easy_parking') && bodyStyle === 'Sedan') ||
    car.model === 'Corolla Cross'
  ) {
    score += 10;
  }

  if (
    needs.includes('future_tech') &&
    (fuelType === 'Electric' ||
      (Array.isArray(car.features) &&
        car.features.some((feature) =>
          /digital|12\.3|hands-free|advanced/i.test(feature)
        )))
  ) {
    score += 10;
  }

  return score;
};

const reasonBuilders = [
  (profile, car) => {
    if (profile.primaryUse === 'family' && (car.bodyStyle === 'SUV' || car.bodyStyle === 'Crossover')) {
      return 'you need space for family and cargo';
    }
    return null;
  },
  (profile, car) => {
    if (profile.primaryUse === 'commuter' && (car.bodyStyle === 'Sedan' || car.bodyStyle === 'Crossover')) {
      return 'it stays efficient for your daily commute';
    }
    return null;
  },
  (profile, car) => {
    const drivetrain = (car.drivetrain || '').toUpperCase();
    if (profile.needs4WD && (drivetrain.includes('AWD') || drivetrain.includes('4WD'))) {
      return 'it brings the traction you asked for';
    }
    return null;
  },
  (profile, car) => {
    if (prefersFuelType(profile, car.fuelType)) {
      return `it aligns with your preference for ${normalizeFuelType(car.fuelType)} power`;
    }
    return null;
  },
  (profile, car) => {
    if (profile.style === 'ev_tech' && normalizeFuelType(car.fuelType) === 'Electric') {
      return 'it delivers the futuristic tech vibe you love';
    }
    if (profile.style === 'truck_offroad' && car.bodyStyle === 'Truck') {
      return 'it is built for the off-road weekends you mentioned';
    }
    if (profile.style === 'sedan_lux' && car.bodyStyle === 'Sedan') {
      return 'it has the sleek, refined feel you’re after';
    }
    if (profile.style === 'crossover_suv' && (car.bodyStyle === 'SUV' || car.bodyStyle === 'Crossover')) {
      return 'it balances practicality with style like you wanted';
    }
    return null;
  },
  (profile, car) => {
    if (Array.isArray(profile.vehicleNeedsTags) && profile.vehicleNeedsTags.includes('future_tech') &&
      (normalizeFuelType(car.fuelType) === 'Electric' ||
        (Array.isArray(car.features) &&
          car.features.some((feature) =>
            /digital|12\.3|advanced park|hands-free/i.test(feature)
          )))) {
      return 'it keeps you ahead with advanced tech touches';
    }
    return null;
  },
  (profile, car) => {
    if (profile.budgetSensitivity >= 4 && (car.price || car.msrp || 0) < 33000) {
      return 'it keeps monthly payments in check';
    }
    return null;
  },
  (profile, car) => {
    if (Array.isArray(profile.vehicleNeedsTags) && profile.vehicleNeedsTags.includes('off_road') && car.bodyStyle === 'Truck') {
      return 'it is set up for trail duty when you head off pavement';
    }
    return null;
  },
  (profile, car) => {
    if (Array.isArray(profile.vehicleNeedsTags) && profile.vehicleNeedsTags.includes('family_space') &&
      (car.bodyStyle === 'SUV' || car.bodyStyle === 'Crossover')) {
      return 'it offers the roomy cabin you called out';
    }
    return null;
  }
];

const buildMatchReasons = (profile, car) => {
  const reasons = reasonBuilders
    .map((builder) => builder(profile, car))
    .filter(Boolean);

  if (!reasons.length && normalizeFuelType(car.fuelType) === 'Hybrid') {
    reasons.push('it delivers hybrid efficiency without sacrificing versatility');
  }

  return dedupe(reasons);
};

const removeLeadingIt = (text) => {
  if (!text) return text;
  return text.replace(/^it\s+/i, '');
};

const buildMatchSummary = (profile, car, reasons) => {
  const intro = `We picked ${car.model}${car.trim ? ` ${car.trim}` : ''} for you because`;
  if (!reasons.length) {
    return `${intro} it is a versatile Toyota that fits a wide range of needs.`;
  }

  const primary = reasons[0];
  if (reasons.length === 1) {
    return `${intro} ${primary}.`;
  }

  const rest = reasons
    .slice(1)
    .map((reason) => removeLeadingIt(reason))
    .join(', and ');
  return `${intro} ${primary}, and it also ${rest}.`;
};

export const rankVehicles = (profile, vehicles, topN = 3) => {
  const scored = vehicles.map((vehicle) => {
    const score = scoreCar(profile, vehicle);
    const reasons = buildMatchReasons(profile, vehicle);
    const summary = buildMatchSummary(profile, vehicle, reasons);
    return {
      vehicle,
      score,
      reasons,
      summary
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN).map((item, index) => ({
    vehicle: item.vehicle,
    score: item.score,
    reasons: item.reasons,
    summary: item.summary,
    rank: index + 1,
    badge: index === 0 ? 'best_match' : 'great_alternative'
  }));
};

export const normalizeProfileOutput = (profile = {}) => {
  const normalized = { ...DEFAULT_PROFILE, ...profile };
  normalized.prefFuel = dedupe(
    (normalized.prefFuel || []).map((fuel) => normalizeFuelType(fuel))
  );
  normalized.vehicleNeedsTags = dedupe(normalized.vehicleNeedsTags || []);
  normalized.keyConcerns = dedupe(normalized.keyConcerns || []);
  return normalized;
};

export const summarizeProfileForDisplay = (profile) => {
  if (!profile) return null;
  return {
    primaryUse: profile.primaryUse,
    style: profile.style,
    prefFuel: (profile.prefFuel || []).map((fuel) => titleCase(fuel)),
    lifeStage: profile.lifeStage
  };
};


