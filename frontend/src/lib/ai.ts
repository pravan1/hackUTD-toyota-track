import { GoogleGenerativeAI } from '@google/generative-ai';
import { estimateFinance, formatCurrency, formatMonthly } from './finance';
import type { Vehicle } from '../types/vehicle';
import type { UserVehicleProfile } from '../store/profile';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type AIMode = 'mock' | 'gemini';

interface ChatContext {
  profile?: UserVehicleProfile;
  vehicles: Vehicle[];
}

const PRIMARY_USE_COPY: Record<string, string> = {
  commuter: 'primarily commuting in the city',
  family: 'hauling family and cargo most days',
  outdoor: 'seeking outdoor and off-road adventures',
  eco_urban: 'focused on tech-forward, eco urban driving'
};

const STYLE_COPY: Record<string, string> = {
  sedan_lux: 'sleek sedan sophistication',
  crossover_suv: 'versatile crossover practicality',
  truck_offroad: 'rugged off-road capability',
  ev_tech: 'futuristic EV innovation'
};

const describeProfileForAI = (profile?: UserVehicleProfile): string => {
  if (!profile) {
    return 'User has not completed the vehicle profile yet.';
  }

  const primaryUse =
    PRIMARY_USE_COPY[profile.primaryUse] || profile.primaryUse || 'mixed driving';
  const fuels = profile.prefFuel?.length
    ? profile.prefFuel.join(', ')
    : 'Open to any fuel';
  const style = STYLE_COPY[profile.style] || profile.style || 'flexible';
  const needs =
    profile.vehicleNeedsTags && profile.vehicleNeedsTags.length
      ? profile.vehicleNeedsTags.join(', ')
      : 'None highlighted';
  const concerns =
    profile.keyConcerns && profile.keyConcerns.length
      ? profile.keyConcerns.join(', ')
      : 'Not specified';

  return `User profile:
- Primary use: ${primaryUse}
- Preferred fuels: ${fuels}
- Style vibe: ${style}
- Budget sensitivity: ${profile.budgetSensitivity}/5
- Vehicle needs: ${needs}
- Key concerns: ${concerns}`;
};

/**
 * MOCK AI - Rule-based responses
 */
function generateMockResponse(message: string, context: ChatContext): string {
  const lowerMessage = message.toLowerCase();
  const availableVehicles = context.vehicles;

  // Greeting
  if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! I'm here to help you find the perfect Toyota vehicle. You can ask me about specific models, compare vehicles, or get recommendations based on your needs. What would you like to know?";
  }

  // Quiz/Profile
  if (lowerMessage.includes('quiz') || lowerMessage.includes('profile')) {
    return "Take our quick profile quiz to get personalized vehicle recommendations! It only takes a minute and helps us understand your budget, lifestyle, and preferences. You can start the quiz from the navigation menu.";
  }

  // Hybrid recommendations
  if (
    lowerMessage.includes('hybrid') &&
    (lowerMessage.includes('best') || lowerMessage.includes('recommend'))
  ) {
    const hybrids = availableVehicles
      .filter((v) => v.fuelType === 'Hybrid')
      .slice(0, 3);
    if (hybrids.length > 0) {
      const list = hybrids
        .map(
          (v) =>
            `**${v.year} ${v.model}${v.trim ? ` ${v.trim}` : ''}** - ${v.mpgCity}/${v.mpgHighway} MPG (city/highway), starting at ${formatCurrency(
              v.price
            )}`
        )
        .join('\n- ');
      return `Great choice! Here are our top hybrid vehicles:\n\n- ${list}\n\nAll of these offer excellent fuel economy and Toyota's proven hybrid technology. Would you like to know more about any of these models?`;
    }
  }

  // SUV recommendations
  if (
    lowerMessage.includes('suv') &&
    (lowerMessage.includes('best') ||
      lowerMessage.includes('recommend') ||
      lowerMessage.includes('family'))
  ) {
    const suvs = availableVehicles
      .filter((v) => v.bodyStyle === 'SUV')
      .slice(0, 3);
    if (suvs.length > 0) {
      const list = suvs
        .map(
          (v) =>
            `**${v.year} ${v.model}${v.trim ? ` ${v.trim}` : ''}** - seats ${v.seats}, starting at ${formatCurrency(
              v.price
            )}`
        )
        .join('\n- ');
      return `I'd recommend these excellent SUVs:\n\n- ${list}\n\nThese vehicles offer great versatility, safety, and space for your needs. Want details on any specific model?`;
    }
  }

  // Budget/cheap/affordable
  if (
    lowerMessage.includes('budget') ||
    lowerMessage.includes('cheap') ||
    lowerMessage.includes('affordable') ||
    lowerMessage.includes('under')
  ) {
    const affordable = [...availableVehicles].sort((a, b) => a.price - b.price).slice(0, 3);
    if (affordable.length > 0) {
      const list = affordable
        .map(
          (v) =>
            `**${v.year} ${v.model}** - ${formatCurrency(v.price)}, ${v.fuelType === 'EV' ? 'Electric powertrain' : `${v.mpgCity}/${v.mpgHighway} MPG`}`
        )
        .join('\n- ');
      return `Here are budget-friendly options:\n\n- ${list}\n\nAll offer excellent value, legendary Toyota reliability, and impressive efficiency. Monthly payments can be as low as ${formatMonthly(estimateFinance(affordable[0].price, 5.5, 60, 3000).monthly)}!`;
    }
  }

  // Compare Camry vs Corolla
  if (
    lowerMessage.includes('compare') &&
    lowerMessage.includes('camry') &&
    lowerMessage.includes('corolla')
  ) {
    const camry = availableVehicles.find(
      (v) => v.model.toLowerCase() === 'camry'
    );
    const corolla = availableVehicles.find(
      (v) => v.model.toLowerCase() === 'corolla'
    );
    if (camry && corolla) {
      return `**Camry vs. Corolla Comparison:**

**${camry.year} ${camry.model}** - ${formatCurrency(camry.price)}
- Midsize sedan with more space
- ${camry.mpgCity}/${camry.mpgHighway} MPG (city/highway)
- Seats ${camry.seats}
- More premium features and comfort

**${corolla.year} ${corolla.model}** - ${formatCurrency(corolla.price)}
- Compact sedan, easier to park
- ${corolla.mpgCity}/${corolla.mpgHighway} MPG (city/highway)
- Seats ${corolla.seats}
- More affordable, great value

**Bottom line:** Corolla is perfect for budget-conscious buyers and city driving. Camry offers more space, power, and premium features for a bit more money.`;
    }
  }

  // Lease vs finance
  if (
    (lowerMessage.includes('lease') || lowerMessage.includes('leasing')) &&
    lowerMessage.includes('financ')
  ) {
    return `**Lease vs. Finance:**

**Leasing:**
- Lower monthly payments
- Drive a new vehicle every 2-3 years
- No worries about resale value
- Mileage limits apply

**Financing:**
- Build equity and own the vehicle
- No mileage restrictions
- Freedom to modify
- Better long-term value if you keep it

**My recommendation:** Lease if you like new cars and drive under 12k miles/year. Finance if you want to own it or drive more than 15k miles/year.`;
  }

  // Electric/EV
  if (lowerMessage.includes('electric') || lowerMessage.includes(' ev ') || lowerMessage.includes('bz4x')) {
    const bz4x = availableVehicles.find((v) => v.model.toLowerCase().includes('bz4x'));
    if (bz4x) {
      return `The **${bz4x.year} ${bz4x.model}** is Toyota's all-electric SUV!

- Approx. 250-mile range on a full charge
- Fast charging capable
- ${bz4x.drivetrain} standard
- Zero emissions
- Starting at ${formatCurrency(bz4x.price)}

It's perfect for eco-conscious drivers who want SUV versatility without gas. Federal tax credits may also be available!`;
    }
  }

  // Safety
  if (lowerMessage.includes('safety') || lowerMessage.includes('safe')) {
    const topSafety = availableVehicles
      .filter((v) =>
        v.features.some((feature) =>
          feature.toLowerCase().includes('toyota safety sense')
        )
      )
      .slice(0, 3);
    return `Safety is our priority! These vehicles include Toyota Safety Sense and advanced driver assistance tech:\n\n${topSafety
      .map(
        (v) => `- **${v.year} ${v.model}** with ${v.drivetrain} and active safety features`
      )
      .join('\n')}\n\nAll include pre-collision braking, lane departure alert, and adaptive cruise control.`;
  }

  const searchResults = availableVehicles
    .filter((v) =>
      `${v.year} ${v.model} ${v.trim ?? ''}`.toLowerCase().includes(lowerMessage)
    )
    .slice(0, 3);
  if (searchResults.length > 0) {
    const vehicle = searchResults[0];
    return `I found the **${vehicle.year} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}**!\n\n- Starting at ${formatCurrency(vehicle.price)}\n- ${vehicle.fuelType === 'EV' ? 'Fully electric powertrain' : `${vehicle.mpgCity}/${vehicle.mpgHighway} MPG (city/highway)`}\n- Seats ${vehicle.seats} passengers\n\nKey features: ${vehicle.features.slice(0, 3).join(', ')}\n\nWould you like to see a payment estimate or compare it with another model?`;
  }

  return `I'd be happy to help! I can assist with:

- **Vehicle recommendations** - Tell me your budget and preferences
- **Comparisons** - Compare any two Toyota models
- **Financing info** - Explain lease vs. finance options
- **Feature details** - Learn about safety, tech, and performance

Try asking: "Best hybrids under $400/mo" or "Compare Camry vs. RAV4" or "Tell me about the Prius"`
}

/**
 * Call Gemini AI API
 */
async function callGeminiAPI(
  message: string,
  context: ChatContext,
  apiKey: string,
  model: string = 'gemini-1.5-flash'
): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const geminiModel = genAI.getGenerativeModel({ model })

    // Build context for Gemini
    const contextStr = `
You are a helpful Toyota vehicle recommendation assistant called Toyota Nexus.

Available vehicles: ${context.vehicles.length} Toyota models including sedans, SUVs, trucks, hybrids, and electric vehicles.

${describeProfileForAI(context.profile)}

Some popular vehicles:
- Camry: Midsize sedan, 32 MPG, $28,400
- RAV4: Compact SUV, 30 MPG, $29,075
- Prius: Hybrid hatchback, 57 MPG, $28,545
- Highlander: 3-row SUV, 24 MPG, $38,980

Your role:
- Provide concise, practical vehicle guidance
- Reference actual Toyota models when relevant
- Explain lease vs finance if asked
- Be friendly but professional
- Keep responses under 200 words

User question: ${message}

Provide a helpful response:`

    const result = await geminiModel.generateContent(contextStr)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to get AI response. Please check your API key and try again.')
  }
}

/**
 * Generate AI response
 */
export async function generateAIResponse(
  message: string,
  mode: AIMode,
  context: ChatContext,
  apiKey?: string,
  model?: string
): Promise<string> {
  if (mode === 'gemini') {
    if (!apiKey) {
      throw new Error('Gemini API key required. Please configure in settings.');
    }
    return await callGeminiAPI(message, context, apiKey, model);
  }

  return generateMockResponse(message, context);
}

/**
 * Get quick suggest chips
 */
export function getQuickSuggestions(profile?: UserVehicleProfile): string[] {
  const suggestions = [
    "Best hybrids under $400/mo",
    "Compare Camry vs. Corolla",
    "Explain lease vs finance",
    "Family-friendly SUVs",
    "Most fuel-efficient vehicles",
  ]

  if (profile) {
    if (
      profile.prefFuel?.some((fuel) => fuel === 'Hybrid' || fuel === 'Electric') ||
      profile.ecoPriority >= 4
    ) {
      suggestions.unshift('Show me eco-friendly options');
    }
    if (
      profile.primaryUse === 'family' ||
      profile.vehicleNeedsTags?.includes('family_space')
    ) {
      suggestions.unshift('Roomiest Toyota family options');
    }
    if (
      profile.primaryUse === 'outdoor' ||
      profile.vehicleNeedsTags?.includes('off_road')
    ) {
      suggestions.unshift('Trail-ready trucks & SUVs');
    }
    if (profile.style === 'ev_tech') {
      suggestions.unshift('Newest Toyota EV tech features');
    }
  }

  return suggestions.slice(0, 4);
}