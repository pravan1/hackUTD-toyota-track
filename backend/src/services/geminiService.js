import { GoogleGenerativeAI } from '@google/generative-ai';

let cachedModel;

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!cachedModel) {
    const client = new GoogleGenerativeAI(apiKey);
    cachedModel = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
    });
  }

  return cachedModel;
};

const extractText = (result) => {
  if (!result) return '';

  if (typeof result.text === 'function') {
    return result.text();
  }

  if (result.response?.text) {
    return result.response.text();
  }

  if (Array.isArray(result.candidates)) {
    return result.candidates
      .map((candidate) =>
        candidate.content?.parts
          ?.map((part) => part.text)
          .filter(Boolean)
          .join('\n')
      )
      .filter(Boolean)
      .join('\n');
  }

  return '';
};

export const generateVehicleSummary = async (vehicle) => {
  const model = getModel();

  const prompt = `
You are an automotive expert who specializes in Toyota vehicles.
Provide a concise yet descriptive summary for the following vehicle geared toward a shopper deciding if it is right for them.

Vehicle details (JSON):
${JSON.stringify(vehicle, null, 2)}

Structure your response with:
- A two-sentence overview
- Three bullet points highlighting standout features
- A short note on the type of driver or lifestyle this trim fits best.
`;

  const result = await model.generateContent(prompt);
  return extractText(result);
};

export const generateVehicleRecommendations = async (input) => {
  const model = getModel();

  const { preferences, vehicles } = input;

  const prompt = `
You are assisting a shopper pick a Toyota vehicle. Consider their preferences and the candidate vehicles from the database.

Preferences:
${JSON.stringify(preferences, null, 2)}

Candidate Vehicles:
${JSON.stringify(vehicles, null, 2)}

Respond with:
1. A friendly intro acknowledging the shopper's needs.
2. Ranked recommendations (numbered list) calling out trim, price range, fuel economy, and why it matches their criteria.
3. A brief closing line inviting them to explore further.
`;

  const result = await model.generateContent(prompt);
  return extractText(result);
};

const cleanJsonText = (raw = '') => {
  const trimmed = raw.trim();
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  }
  return trimmed;
};

export const extractVehicleProfileInsights = async ({
  lifeChapter,
  stressNonNegotiables
}) => {
  const model = getModel();

  const responses = [
    {
      prompt: 'Life chapter',
      answer: lifeChapter || ''
    },
    {
      prompt: 'Stress & non-negotiables',
      answer: stressNonNegotiables || ''
    }
  ]
    .filter((item) => item.answer && item.answer.trim().length > 0)
    .map(
      (item) =>
        `${item.prompt}:\n${item.answer.trim().replace(/\s+/g, ' ').trim()}`
    )
    .join('\n\n');

  if (!responses) {
    return null;
  }

  const prompt = `
Extract a structured JSON profile from this user's text. Focus only on these fields:

life_stage: one of ["student", "young_professional", "new_parent", "growing_family", "retiree", "adventurer"].
top_goals: short list of natural language goals.
vehicle_needs: list of tags like ["family_space", "off_road", "easy_parking", "long_range", "luxury_feel", "future_tech"].
financial_sentiment: one of ["very_cost_sensitive", "balanced", "flexible_spender"].
key_concerns: list of strings like ["fuel_costs", "range_anxiety", "safety", "maintenance", "parking", "reliability", "charging"].

Return ONLY valid JSON.

User responses:
${responses}
`;

  const result = await model.generateContent(prompt);
  const text = extractText(result);
  const cleaned = cleanJsonText(text);
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn('Failed to parse Gemini JSON payload', { cleaned });
    return null;
  }
};

