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

